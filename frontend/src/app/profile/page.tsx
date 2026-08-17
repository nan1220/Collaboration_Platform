"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import { useCurrentUser } from "@/lib/current-user";
import { UserAvatar } from "@/components/user-avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MarkdownEditor } from "@/components/markdown-editor";
import { SignInPrompt } from "@/components/sign-in-prompt";
import { useLanguage, roleLabel } from "@/lib/i18n";

const EMPTY_STUDENT_PROFILE = {
  areas_of_expertise: "",
  research_interests: "",
  skills: "",
  previous_projects: "",
  availability: "",
  looking_for_team: false,
  team_message: "",
};

export default function ProfilePage() {
  const { currentUser } = useCurrentUser();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const isStudent = currentUser?.role === "student";
  const isCompany = currentUser?.role === "company";
  const isProfessor = currentUser?.role === "professor";

  const [bio, setBio] = useState("");
  useEffect(() => {
    setBio(currentUser?.bio ?? "");
  }, [currentUser?.bio]);

  const bioMutation = useMutation({
    mutationFn: (value: string) => api.updateProfile(currentUser!.id, { bio: value }),
    onSuccess: () => {
      toast.success(t("toast.profileUpdated"));
      queryClient.invalidateQueries({ queryKey: ["demo-users"] });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Failed to update profile"),
  });

  const { data: directory = [] } = useQuery({
    queryKey: ["student-directory", currentUser?.id],
    queryFn: () => api.studentDirectory(),
    enabled: isStudent,
  });
  const myStudentProfile = directory.find((p) => p.student.id === currentUser?.id);

  const [studentProfile, setStudentProfile] = useState(EMPTY_STUDENT_PROFILE);
  useEffect(() => {
    if (myStudentProfile) setStudentProfile(myStudentProfile);
  }, [myStudentProfile]);

  const saveStudentProfileMutation = useMutation({
    mutationFn: (values: typeof studentProfile) => api.updateStudentProfile(currentUser!.id, values),
    onSuccess: () => {
      toast.success(t("toast.profileUpdated"));
      queryClient.invalidateQueries({ queryKey: ["student-directory"] });
      queryClient.invalidateQueries({ queryKey: ["students-looking-for-team"] });
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : "Failed to save profile"),
  });

  const { data: myCompany } = useQuery({
    queryKey: ["my-company", currentUser?.id],
    queryFn: () => api.myCompany(currentUser!.id),
    enabled: isCompany,
  });

  if (!currentUser) {
    return <SignInPrompt>{t("prompt.profile")}</SignInPrompt>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("page.profile.title")}</h1>
        <p className="mt-1 text-muted-foreground">{t("page.profile.description")}</p>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-5 pt-6 sm:flex-row sm:items-start">
          <UserAvatar name={currentUser.name} size="lg" className="mt-0.5 shrink-0" />
          <div className="flex flex-1 flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <h2 className="text-xl font-semibold tracking-tight">{currentUser.name}</h2>
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="secondary">{roleLabel(currentUser.role, t)}</Badge>
                {isProfessor && (
                  <>
                    <Badge variant="outline">
                      {t("page.professor.chair")}: {currentUser.department || t("page.professor.noneSet")}
                    </Badge>
                    <Badge variant="outline">
                      {t("page.professor.expertise")}: {currentUser.expertise || t("page.professor.noneSet")}
                    </Badge>
                  </>
                )}
                {isStudent && currentUser.program && (
                  <Badge variant="outline">
                    {t("page.profile.program")}: {currentUser.program}
                  </Badge>
                )}
                {isCompany && myCompany && (
                  <>
                    <Badge variant="outline">
                      {t("page.profile.company")}: {myCompany.name}
                    </Badge>
                    <Badge variant={myCompany.verified ? "success" : "outline"}>
                      {myCompany.verified ? t("page.company.verified") : t("page.company.awaitingVerification")}
                    </Badge>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="bio">{t("page.profile.bioLabel")}</Label>
              <MarkdownEditor
                id="bio"
                rows={4}
                value={bio}
                onChange={setBio}
                placeholder={t("page.profile.bioPlaceholder")}
              />
              <Button
                className="self-start"
                size="sm"
                onClick={() => bioMutation.mutate(bio)}
                disabled={bioMutation.isPending || bio === (currentUser.bio ?? "")}
              >
                {t("page.profile.saveBio")}
              </Button>
            </div>

            {isCompany && myCompany && (
              <p className="text-sm text-muted-foreground">
                {t("page.profile.contact")}: {myCompany.contact_name} ({myCompany.contact_email})
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {isStudent && (
        <Card>
          <CardHeader>
            <CardTitle>{t("page.profile.myTopicTitle")}</CardTitle>
            <CardDescription>{t("page.profile.myTopicDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="expertise">Areas of expertise</Label>
              <Input
                id="expertise"
                value={studentProfile.areas_of_expertise}
                onChange={(e) => setStudentProfile((p) => ({ ...p, areas_of_expertise: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="research">Research interests</Label>
              <Input
                id="research"
                value={studentProfile.research_interests}
                onChange={(e) => setStudentProfile((p) => ({ ...p, research_interests: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="skills">Skills</Label>
              <Input
                id="skills"
                value={studentProfile.skills}
                onChange={(e) => setStudentProfile((p) => ({ ...p, skills: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="previous">Previous projects</Label>
              <Textarea
                id="previous"
                rows={2}
                value={studentProfile.previous_projects}
                onChange={(e) => setStudentProfile((p) => ({ ...p, previous_projects: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="availability">Availability</Label>
              <Input
                id="availability"
                value={studentProfile.availability}
                onChange={(e) => setStudentProfile((p) => ({ ...p, availability: e.target.value }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="team-message">Message for teammates (shown only if flagged below)</Label>
              <Textarea
                id="team-message"
                rows={2}
                value={studentProfile.team_message}
                onChange={(e) => setStudentProfile((p) => ({ ...p, team_message: e.target.value }))}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => saveStudentProfileMutation.mutate(studentProfile)}
                disabled={saveStudentProfileMutation.isPending}
              >
                Save profile
              </Button>
              <Button
                variant={studentProfile.looking_for_team ? "destructive" : "secondary"}
                onClick={() => {
                  const next = { ...studentProfile, looking_for_team: !studentProfile.looking_for_team };
                  setStudentProfile(next);
                  saveStudentProfileMutation.mutate(next);
                }}
                disabled={saveStudentProfileMutation.isPending}
              >
                {studentProfile.looking_for_team ? "Remove me from the teammate list" : "List me as looking for a team"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
