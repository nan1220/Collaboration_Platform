"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Role } from "./types";

export type Locale = "en" | "de";

const STORAGE_KEY = "collab-platform-locale";

// NFR-3: "The platform should be viewable in German and English language."
// Flat dot-path keys rather than nested objects — simplest to keep the two
// dictionaries in sync and to extend. Covers the shared chrome (nav, footer,
// home, sign-in/registration flow) fully, plus the title/description of
// every other page — deeper form-field labels stay English for now.
const en = {
  "nav.projects": "Projects",
  "nav.studentDirectory": "Student directory",
  "nav.findTeammates": "Find teammates",
  "nav.guides": "Guides",
  "nav.staffDashboard": "Staff dashboard",
  "nav.mySupervision": "My supervision",
  "nav.myCompany": "My company",
  "nav.myApplications": "My applications",
  "nav.signIn": "Sign in",
  "nav.signOut": "Sign out",
  "nav.signedInSession": "Signed in for this demo session.",
  "nav.language": "Language",

  "footer.tagline": "Collaboration Platform — a project topic database prototype.",
  "footer.submitProject": "Submit a project",

  "home.heroSubtitle":
    "One consistent database for company and professor/supervisor-submitted project topics — shared by staff, professors/supervisors, students and companies, instead of a spreadsheet nobody else can see.",
  "home.browseProjects": "Browse projects",
  "home.submitProjectCompany": "Submit a project (company)",
  "home.notSignedInTitle": "You're not signed in",
  "home.notSignedInDesc": "TUM members sign in with Shibboleth; companies register with a work email (FR-1/NFR-1).",
  "home.whatThisReplaces": "What this replaces",

  "home.role.staff.title": "Staff dashboard",
  "home.role.staff.description": "Review company submissions, monitor every project by status, and verify companies.",
  "home.role.staff.link1": "Open staff dashboard",
  "home.role.staff.link2": "Browse all projects",
  "home.role.professor.title": "Supervision",
  "home.role.professor.description":
    "Take on topics matched to your expertise, or submit a project agreed directly with a company.",
  "home.role.professor.link1": "Open my supervision",
  "home.role.professor.link2": "Browse the student directory",
  "home.role.company.title": "Company dashboard",
  "home.role.company.description": "Submit project proposals and browse student topics and profiles.",
  "home.role.company.link1": "Open my company dashboard",
  "home.role.company.link2": "Browse the student directory",
  "home.role.student.title": "Student home",
  "home.role.student.description": "Browse published projects, submit your topic and profile, and track your applications.",
  "home.role.student.link1": "Browse projects",
  "home.role.student.link2": "My applications and profile",
  "home.role.student.link3": "Read guides",

  "home.feature.database.title": "One shared database",
  "home.feature.database.description":
    "Staff, professors/supervisors, students and companies all see the same project data and status history — not a spreadsheet only two people can read.",
  "home.feature.companySubmissions.title": "Company submissions",
  "home.feature.companySubmissions.description":
    "Companies submit a topic through a portal (FR-2). Staff approve it, a matching professor/supervisor takes it on and publishes it (FR-6).",
  "home.feature.studentTopics.title": "Student topics & teammates",
  "home.feature.studentTopics.description":
    "Students submit a topic and profile that professors/supervisors and companies can browse (FR-4/FR-8/FR-9), and can flag themselves as looking for a team (FR-10).",
  "home.feature.guides.title": "Guides that actually help",
  "home.feature.guides.description":
    "Concrete, TUM-specific guidance — like finding a professor/supervisor whose expertise matches a topic — instead of word of mouth.",

  "signIn.title": "Sign in",
  "signIn.subtitle": "How you get in depends on who you are (FR-1/NFR-1).",
  "signIn.tumMembers.title": "TUM members",
  "signIn.tumMembers.description": "Students, professors/supervisors and staff sign in with their TUM institutional account.",
  "signIn.tumMembers.action": "Continue with Shibboleth",
  "signIn.companies.title": "Companies",
  "signIn.companies.description":
    "No TUM account needed — log in with your work email, or register a new company. Staff verify new companies before they can submit a project (NFR-1).",
  "signIn.companies.action": "Log in or register",
  "signInPrompt.action": "Sign in",

  "shibboleth.title": "TUM Shibboleth Login (simulated)",
  "shibboleth.description":
    "In production this would redirect to TUM's real Shibboleth identity provider (NFR-1). This prototype has no institutional backend to redirect to, so it simulates the round trip here instead.",
  "shibboleth.firstTime": "First time signing in",
  "shibboleth.firstTimeDesc":
    "A real Shibboleth login releases your identity attributes (name, affiliation) to the platform, which creates your account automatically the first time it sees them — simulated here by just asking for that information directly.",
  "shibboleth.fullName": "Full name",
  "shibboleth.affiliation": "Affiliation",
  "shibboleth.chairDepartment": "Chair",
  "shibboleth.expertise": "Expertise",
  "shibboleth.bio": "Short bio (optional)",
  "shibboleth.degreeProgram": "Degree program",
  "shibboleth.signInAction": "Sign in via Shibboleth",
  "role.student": "Student",
  "role.professor": "Professor / Supervisor",
  "role.staff": "University staff",
  "role.company": "Company",
  "shibboleth.quickSignIn": "Mock sign-in for testing",
  "shibboleth.quickSignInDesc": "Testing shortcut for this prototype only — would not exist in a real deployment.",

  "toast.signedIn": "Signed in",
  "toast.companyRegistered": "Company registered — pending staff verification",
  "toast.signInFailed": "Sign-in failed",
  "toast.registrationFailed": "Registration failed",

  "register.title": "Company access",
  "register.description":
    "No TUM account needed. Already registered? Sign in below. New here? Register your company — staff confirm new companies before they can submit a project (NFR-1).",
  "register.alreadyRegistered": "Already registered",
  "register.workEmail": "Work email",
  "register.logIn": "Log in",
  "register.newCompany": "New company",
  "register.companyName": "Company name",
  "register.contactPerson": "Contact person",
  "register.registerAction": "Register",

  "signOutMenu.title": "Account",

  "prompt.staff": "Sign in with a staff account to see this dashboard.",
  "prompt.professor": "Sign in with a professor/supervisor account to see this dashboard.",
  "prompt.student": "Sign in with a student account to see this page.",
  "prompt.company": "Sign in with a company account (or register one) to see this dashboard.",
  "prompt.studentDirectory": "Sign in as a professor/supervisor, company or staff account to browse student topics and profiles.",

  "page.staff.title": "Staff dashboard",
  "page.staff.description":
    "Review incoming submissions and monitor every project study by status (FR-17) — the visibility the shared Excel sheet never had.",
  "page.professor.title": "My supervision",
  "page.professor.description":
    "Topics matched to your expertise ({expertise}), the projects you supervise, and direct submissions for projects already agreed with a company.",
  "page.professor.noneSet": "none set",
  "page.professor.chair": "Chair",
  "page.professor.expertise": "Expertise",
  "page.professor.noBio": "No bio set yet — added on first Shibboleth sign-in.",
  "page.professor.statSupervising": "Supervising",
  "page.professor.statFilled": "Completed",
  "page.professor.statMatched": "Matched topics",
  "page.student.title": "My applications",
  "page.student.description": "Projects you've applied to and their decision status.",
  "page.company.title": "My company",
  "page.company.description": "Submit project proposals (FR-2) and track their status. Browse the student directory (FR-4) to scout ahead of applications.",
  "page.company.verified": "Verified",
  "page.company.awaitingVerification": "Awaiting staff verification",
  "page.projects.title": "Projects",
  "page.guides.title": "Guides",
  "page.guides.description":
    "Practical, TUM-specific guidance — like how to find an eligible supervisor for a company-submitted topic — instead of figuring it out through word of mouth.",
  "page.teammates.title": "Find teammates",
  "page.students.title": "Student directory",
  "page.students.description":
    "Topics and profile data submitted by students (FR-4/FR-8), filterable by program (FR-9) — so companies and professors/supervisors can scout ahead instead of waiting for applications.",

  "common.loading": "Loading…",
} as const;

const de: Record<keyof typeof en, string> = {
  "nav.projects": "Projekte",
  "nav.studentDirectory": "Studierendenverzeichnis",
  "nav.findTeammates": "Teampartner finden",
  "nav.guides": "Leitfäden",
  "nav.staffDashboard": "Mitarbeiter-Dashboard",
  "nav.mySupervision": "Meine Betreuung",
  "nav.myCompany": "Mein Unternehmen",
  "nav.myApplications": "Meine Bewerbungen",
  "nav.signIn": "Anmelden",
  "nav.signOut": "Abmelden",
  "nav.signedInSession": "Für diese Demo-Sitzung angemeldet.",
  "nav.language": "Sprache",

  "footer.tagline": "Collaboration Platform — ein Prototyp für eine Projektthemen-Datenbank.",
  "footer.submitProject": "Projekt einreichen",

  "home.heroSubtitle":
    "Eine einheitliche Datenbank für von Unternehmen und Professor:innen/Betreuer:innen eingereichte Projektthemen — gemeinsam genutzt von Mitarbeitenden, Professor:innen/Betreuer:innen, Studierenden und Unternehmen, statt einer Tabelle, die sonst niemand einsehen kann.",
  "home.browseProjects": "Projekte durchsuchen",
  "home.submitProjectCompany": "Projekt einreichen (Unternehmen)",
  "home.notSignedInTitle": "Sie sind nicht angemeldet",
  "home.notSignedInDesc": "TUM-Angehörige melden sich mit Shibboleth an; Unternehmen registrieren sich mit einer geschäftlichen E-Mail-Adresse (FR-1/NFR-1).",
  "home.whatThisReplaces": "Was dies ersetzt",

  "home.role.staff.title": "Mitarbeiter-Dashboard",
  "home.role.staff.description": "Unternehmenseinreichungen prüfen, jedes Projekt nach Status verfolgen und Unternehmen verifizieren.",
  "home.role.staff.link1": "Mitarbeiter-Dashboard öffnen",
  "home.role.staff.link2": "Alle Projekte durchsuchen",
  "home.role.professor.title": "Betreuung",
  "home.role.professor.description":
    "Themen übernehmen, die zu Ihrem Fachgebiet passen, oder ein direkt mit einem Unternehmen vereinbartes Projekt einreichen.",
  "home.role.professor.link1": "Meine Betreuung öffnen",
  "home.role.professor.link2": "Studierendenverzeichnis durchsuchen",
  "home.role.company.title": "Unternehmens-Dashboard",
  "home.role.company.description": "Projektvorschläge einreichen und Themen sowie Profile von Studierenden durchsuchen.",
  "home.role.company.link1": "Unternehmens-Dashboard öffnen",
  "home.role.company.link2": "Studierendenverzeichnis durchsuchen",
  "home.role.student.title": "Startseite für Studierende",
  "home.role.student.description":
    "Veröffentlichte Projekte durchsuchen, eigenes Thema und Profil einreichen und Bewerbungen verfolgen.",
  "home.role.student.link1": "Projekte durchsuchen",
  "home.role.student.link2": "Meine Bewerbungen und Profil",
  "home.role.student.link3": "Leitfäden lesen",

  "home.feature.database.title": "Eine gemeinsame Datenbank",
  "home.feature.database.description":
    "Mitarbeitende, Professor:innen/Betreuer:innen, Studierende und Unternehmen sehen alle dieselben Projektdaten und den Statusverlauf — keine Tabelle, die nur zwei Personen lesen können.",
  "home.feature.companySubmissions.title": "Unternehmenseinreichungen",
  "home.feature.companySubmissions.description":
    "Unternehmen reichen ein Thema über ein Portal ein (FR-2). Mitarbeitende genehmigen es, ein passender Professor / Betreuer übernimmt und veröffentlicht es (FR-6).",
  "home.feature.studentTopics.title": "Studierendenthemen & Teampartner",
  "home.feature.studentTopics.description":
    "Studierende reichen ein Thema und Profil ein, das Professor:innen/Betreuer:innen und Unternehmen durchsuchen können (FR-4/FR-8/FR-9), und können sich als teamsuchend markieren (FR-10).",
  "home.feature.guides.title": "Leitfäden, die wirklich helfen",
  "home.feature.guides.description":
    "Konkrete, TUM-spezifische Hinweise — etwa wie man eine passende Betreuung findet — statt Mundpropaganda.",

  "signIn.title": "Anmelden",
  "signIn.subtitle": "Wie Sie sich anmelden, hängt davon ab, wer Sie sind (FR-1/NFR-1).",
  "signIn.tumMembers.title": "TUM-Angehörige",
  "signIn.tumMembers.description": "Studierende, Professor:innen/Betreuer:innen und Mitarbeitende melden sich mit ihrem TUM-Institutionskonto an.",
  "signIn.tumMembers.action": "Weiter mit Shibboleth",
  "signIn.companies.title": "Unternehmen",
  "signIn.companies.description":
    "Kein TUM-Konto nötig — melden Sie sich mit Ihrer geschäftlichen E-Mail an oder registrieren Sie ein neues Unternehmen. Mitarbeitende verifizieren neue Unternehmen, bevor sie ein Projekt einreichen können (NFR-1).",
  "signIn.companies.action": "Anmelden oder registrieren",
  "signInPrompt.action": "Anmelden",

  "shibboleth.title": "TUM-Shibboleth-Anmeldung (simuliert)",
  "shibboleth.description":
    "In der Produktivumgebung würde dies zum echten Shibboleth-Identitätsanbieter der TUM weiterleiten (NFR-1). Dieser Prototyp hat kein institutionelles Backend, daher wird der Ablauf hier simuliert.",
  "shibboleth.firstTime": "Erste Anmeldung",
  "shibboleth.firstTimeDesc":
    "Eine echte Shibboleth-Anmeldung gibt Ihre Identitätsattribute (Name, Zugehörigkeit) an die Plattform weiter, die daraus beim ersten Mal automatisch ein Konto anlegt — hier simuliert, indem diese Angaben direkt abgefragt werden.",
  "shibboleth.fullName": "Vollständiger Name",
  "shibboleth.affiliation": "Zugehörigkeit",
  "shibboleth.chairDepartment": "Lehrstuhl",
  "shibboleth.expertise": "Fachgebiet",
  "shibboleth.bio": "Kurzprofil (optional)",
  "shibboleth.degreeProgram": "Studiengang",
  "shibboleth.signInAction": "Mit Shibboleth anmelden",
  "role.student": "Studierende:r",
  "role.professor": "Professor:in / Betreuer:in",
  "role.staff": "Universitätsmitarbeiter:in",
  "role.company": "Unternehmen",
  "shibboleth.quickSignIn": "Mock-Anmeldung zu Testzwecken",
  "shibboleth.quickSignInDesc": "Nur ein Testkürzel für diesen Prototyp — würde in einer echten Umgebung nicht existieren.",

  "toast.signedIn": "Angemeldet",
  "toast.companyRegistered": "Unternehmen registriert — Bestätigung durch Mitarbeitende steht aus",
  "toast.signInFailed": "Anmeldung fehlgeschlagen",
  "toast.registrationFailed": "Registrierung fehlgeschlagen",

  "register.title": "Unternehmenszugang",
  "register.description":
    "Kein TUM-Konto nötig. Bereits registriert? Melden Sie sich unten an. Neu hier? Registrieren Sie Ihr Unternehmen — Mitarbeitende bestätigen neue Unternehmen, bevor sie ein Projekt einreichen können (NFR-1).",
  "register.alreadyRegistered": "Bereits registriert",
  "register.workEmail": "Geschäftliche E-Mail",
  "register.logIn": "Anmelden",
  "register.newCompany": "Neues Unternehmen",
  "register.companyName": "Unternehmensname",
  "register.contactPerson": "Ansprechpartner:in",
  "register.registerAction": "Registrieren",

  "signOutMenu.title": "Konto",

  "prompt.staff": "Melden Sie sich mit einem Mitarbeiterkonto an, um dieses Dashboard zu sehen.",
  "prompt.professor": "Melden Sie sich mit einem Professor:innen-/Betreuer:innenkonto an, um dieses Dashboard zu sehen.",
  "prompt.student": "Melden Sie sich mit einem Studierendenkonto an, um diese Seite zu sehen.",
  "prompt.company": "Melden Sie sich mit einem Unternehmenskonto an (oder registrieren Sie eines), um dieses Dashboard zu sehen.",
  "prompt.studentDirectory":
    "Melden Sie sich als Professor:in/Betreuer:in, Unternehmen oder Mitarbeiter:in an, um Themen und Profile von Studierenden zu durchsuchen.",

  "page.staff.title": "Mitarbeiter-Dashboard",
  "page.staff.description":
    "Eingehende Einreichungen prüfen und jede Projektarbeit nach Status verfolgen (FR-17) — die Übersicht, die die gemeinsame Excel-Tabelle nie bot.",
  "page.professor.title": "Meine Betreuung",
  "page.professor.description":
    "Themen passend zu Ihrem Fachgebiet ({expertise}), die von Ihnen betreuten Projekte sowie direkt mit einem Unternehmen vereinbarte Einreichungen.",
  "page.professor.noneSet": "nicht angegeben",
  "page.professor.chair": "Lehrstuhl",
  "page.professor.expertise": "Fachgebiet",
  "page.professor.noBio": "Noch kein Kurzprofil hinterlegt — wird bei der ersten Shibboleth-Anmeldung angegeben.",
  "page.professor.statSupervising": "Betreut",
  "page.professor.statFilled": "Abgeschlossen",
  "page.professor.statMatched": "Passende Themen",
  "page.student.title": "Meine Bewerbungen",
  "page.student.description": "Projekte, auf die Sie sich beworben haben, und deren Entscheidungsstatus.",
  "page.company.title": "Mein Unternehmen",
  "page.company.description": "Projektvorschläge einreichen (FR-2) und deren Status verfolgen. Durchsuchen Sie das Studierendenverzeichnis (FR-4), um vor Bewerbungen vorab zu sichten.",
  "page.company.verified": "Verifiziert",
  "page.company.awaitingVerification": "Verifizierung durch Mitarbeitende steht aus",
  "page.projects.title": "Projekte",
  "page.guides.title": "Leitfäden",
  "page.guides.description":
    "Konkrete, TUM-spezifische Hinweise — etwa wie man eine geeignete Betreuung für ein von einem Unternehmen eingereichtes Thema findet — statt Mundpropaganda.",
  "page.teammates.title": "Teampartner finden",
  "page.students.title": "Studierendenverzeichnis",
  "page.students.description":
    "Von Studierenden eingereichte Themen und Profildaten (FR-4/FR-8), filterbar nach Studiengang (FR-9) — damit Unternehmen und Professor:innen/Betreuer:innen vorab sichten können, statt auf Bewerbungen zu warten.",

  "common.loading": "Wird geladen…",
};

const dictionaries: Record<Locale, Record<keyof typeof en, string>> = { en, de };

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof typeof en) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored === "en" || stored === "de") {
      setLocaleState(stored);
    } else if (window.navigator.language.toLowerCase().startsWith("de")) {
      setLocaleState("de");
    }
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  };

  const t = (key: keyof typeof en) => dictionaries[locale][key];

  return <LanguageContext.Provider value={{ locale, setLocale, t }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

// Shared role -> display label mapping (e.g. "professor" -> "Professor / Supervisor"),
// so every badge/picker shows the same terminology instead of just capitalizing the
// raw role value.
export function roleLabel(role: Role, t: (key: keyof typeof en) => string) {
  if (role === "staff") return t("role.staff");
  if (role === "professor") return t("role.professor");
  if (role === "company") return t("role.company");
  return t("role.student");
}
