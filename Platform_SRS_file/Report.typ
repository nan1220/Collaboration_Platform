// #import "@preview/cuti:0.4.0": fakebold

// #import "@preview/wordometer:0.1.5": word-count, total-words

// #show: word-count



// HERE THE TITLE PAGE IS SET UP
// #set page(
// 	paper: "a4",
// 	margin: (top: 20mm, bottom: 20mm, left: 25mm, right: 20mm),
// )
#set page(
	paper: "a4",
	margin: (top: 30mm, bottom: 20mm, left: 20mm, right: 2mm),
)

#let document_font = "TeX Gyre Heros"

#set text(font: document_font)

#set par(leading: 0.95em)  // smaller global line spacing

#let tum_blue = rgb("0065BD")

// --- Content placeholders ---
#let essay_title = "Software Requirements Specification for a Collaboration Platform for Project Studies"
// #let essay_title = "Gradient-Based"
#let essay_subtitle = "Report for Project Study"
#let author_name = "Nan Jiang"
#let examiner_name = "Prof. Dr. Miriam Bird"
#let supervisor_name="Lorenz Tidow"
#let submited_date="16.08.2026"

// --- Header ---
#grid(
	columns: (140mm, auto),
	align: (left, top),
	gutter: 11mm,
)[
	#block[
		#set text(size: 8.4pt, fill: tum_blue)
		#set par(leading: 0.7em)  // tighter header spacing
		Chair of Entrepreneurship and Family Enterprise \
		TUM School of Management \
		Technical University of Munich
	]
][
	#image("Universitaet_Logo_RGB.pdf", height: 10mm)
]

#v(10mm)

// --- Title Section ---
#[
	#set text(size: 24pt)
	#set par(leading: 0.5em)
	*#essay_title*
]

#v(1mm)

// #text(size: 14pt)[#essay_subtitle]
#box(width: 165mm)[
  #text(size: 14pt)[#essay_subtitle]
]

#v(16mm)

#text(size: 16pt, fill: tum_blue)[*#author_name*]

// #v(4mm)

// --- Degree Line ---
#block[
	#set text(size: 13pt)
	#set par(leading: 0.6em)
	*B.Sc. Management and Data Science* \
	at TUM School of Management of the Technical University of Munich
]

#text(size: 16pt, fill: tum_blue)[*Jasmin Yalçın*]

#block[
	#set text(size: 13pt)
	#set par(leading: 0.6em)
	*B.Sc. Management and Data Science* \
	at TUM School of Management of the Technical University of Munich
]

// #text(size: 16pt, fill: tum_blue, fakebold(text[Ahmet Akpunar]))

// #block[
// 	#set text(size: 13pt)
// 	#set par(leading: 0.6em)
// 	*B.Sc. Management and Data Science* \
// 	at TUM School of Management of the Technical University of Munich
// ]

#v(20mm)

// --- Examiner ---
#block[
	#set text(size: 13pt)
	#set par(leading: 0.6em)
	*Examiner* \
	#examiner_name \
	Chair of Entrepreneurship and Family Enterprise

	*Supervisor*\
	#supervisor_name\
	Ph.D. Candidate and Research Associate

	*Submission date*\
	#submited_date

]

// --- Bottom Image ---
// #place(
// 	bottom + right,
// 	[
// 		#image("TUM_Uhrenturm.png", height: 120mm)
// 		In this essay, there are #total-words words all up.
// 	],
// 	dx: -20mm,
// )


#place(
  bottom + right,
  image("TUM_Uhrenturm.png", height: 105mm),
  dx: -6mm,
  dy: 8mm,
)

// --- new page ---
// #set page(
// 	paper: "a4",
// 	margin: (top: 20mm, bottom: 20mm, left: 25mm, right: 20mm),
// )
// #set text(size: 12pt)
// #set page(numbering: "1", number-align: center)

// #set par(leading: 0.95em,
// 		  spacing: 1.5em)  // 1.5 line spacing, with extra space between paragraphs, global for the essay after the title page


#set page(
  paper: "a4",
  numbering: "1",
  number-align: center,
  margin: (left: 2.5cm, right: 3cm, top: 2.5cm, bottom: 2.5cm),
)

#set text(font: document_font, size: 12pt, lang: "en")
#set par(justify: true, leading: 1em, spacing: 1.5em)

// Footnotes: 10 pt, single spacing, justified
#show footnote.entry: it => {
  set text(size: 10pt)
  set par(leading: 0.65em, justify: true)
  it
}

#show figure.caption: c => [
  *#c.supplement #c.counter.display(c.numbering)*#c.separator#c.body
]

#set cite(form: "prose")


#set heading(
	numbering: "1.",

)

#[
	#set par(leading: 0.7em)
	#outline(depth: 2, title: [
		Contents
		#v(4mm)
	])
]


// #set page(
// 	paper: "a4",
// 	margin: (top: 20mm, bottom: 20mm, left: 25mm, right: 20mm),
// )
// #set text(size: 12pt)

#set page(
  paper: "a4",
  margin: (left: 2.5cm, right: 3cm, top: 2.5cm, bottom: 2.5cm),
)

#set text(font: document_font, size: 12pt, lang: "en")
#set par(justify: true, leading: 1em, spacing: 1.5em)

// Footnotes: 10 pt, single spacing, justified
#show footnote.entry: it => {
  set text(size: 10pt)
  set par(leading: 0.65em, justify: true)
  it
}

= Introduction


== Purpose of this Document 
== Project Background and Motivation 
== Scope of the Platform 
== Definitions, Acronyms, and Abbreviations 
== Document Overview


#pagebreak()
= Literature review

// In this section we provide a review of industry and academic practices in requirements engineering, focusing on the elicitation of requirements from stakeholders. We describe the sources for our methodology, including the choice of standard, the interview-based elicitation method, and the literature on small-sample saturation. We also discuss traceability practices and prioritization schemes relevant to this project.

In this section we review the academic grounding for the project’s methodological choices. In particular, the requirements engineering approach and the broader phenomenon of academia-industry collaboration that the platform aims to address.

== Requirements Engineering Grounding


=== Selection and Adaptation of the Requirements Engineering Standard
This specification follows ISO/IEC/IEEE 29148:2018 #cite(<IEEE29148_2018>, form: "normal") -- the current international standard for requirements engineering, which supersedes IEEE 830-1998 #cite(<IEEE830_1998>, form: "normal"). The predecessor addressed the specification document alone, whereas 29148 covers the requirements process as a whole, including elicitation, analysis and validation. Consequently, such a form is more appropriate for this project, since much of what follows concerns how requirements were derived from stakeholder interviews and how strongly each is supported. The standard is applied in scaled-down form appropriate to a single-semester project and extended with a literature review section to meet the academic requirements of a project study report.

=== Interview-Based Requirements Elicitation
Semi-structured interviews were used to explore stakeholder needs without assuming predefined system requirements. @ferrari2022requirementsevolveelicitationempirical show that interviews support an iterative elicitation process in which stakeholder initial ideas are progressively clarified and refined into requirements through the dialogue and iterative feedback. Accordingly, this project first analyzed interview data inductively to identify recurring needs and pain points, which then served as the basis for deriving platform requirements.

=== Sample Adequacy and Thematic Saturation
@macqueen1998codebook defined thematic saturation as the point at which no new codes emerge from additional interviews. And, the number of interviews required to reach the point of saturation is a recurring question in qualitative research. 

@guest2006many found that little new information emerged after the first 12 of their 60 interviews.

@hennink2017code argue that the answer depends on what saturation is taken to mean. No new codes appeared in their data after 9 interviews, but arriving at a rich understanding of those codes took between 16 and 24. These figures come from fairly uniform groups of participants. 

@hagaman2017crosscultural worked across 4 sites and found that 16 interviews or fewer sufficed within a single group, while themes running across groups needed 20 to 40.

These thresholds provide a basis for assessing the 26 interviews conducted for this study rather than merely reporting their number. The student group, at 13 interviews, exceeds the code-saturation threshold reported by Hennink et al. and falls within the range Hagaman and Wutich associate with thematic convergence in a single group; the pain points reported for students in @student-pain-points can therefore be regarded as reasonably stable. The company, professor and university-staff groups, at 5, 6 and 2 interviews respectively, fall below every threshold cited above, and findings specific to them are correspondingly treated as indicative. The cross-cutting findings in @cross-cutting-findings, which draw on the full sample of 26, sit within the range associated with cross-group themes, though not at its upper end. Requirements are accordingly framed throughout as informed proposals rather than validated findings.


=== Requirements Traceability

Requirements traceability is the ability to follow a requirement forward into design and implementation and backward to the source it came from. @traceability1994, drawing on interviews and questionnaires with over 100 practitioners, distinguish these two directions and argue that the backward one is where projects usually fail.

#figure(
  caption: [Illustration of the two directions of requirements traceability from @traceability1994],
)[
  #image("Two basic types of requirements traceability.pdf", width: 80%)
]

Post-specification traceability, linking requirements to what was built from them, is comparatively well supported by tools. Pre-specification traceability, linking a requirement back to the stakeholder statement and rationale that produced it, tends to be neglected, and most of the problems attributed to poor traceability turn out to originate there. //Section 9 is structured around this backward direction, recording for each requirement the pain point and interview material it derives from, before mapping it forward to the prototype.

@traceability-prototype-alignment is organised along both directions: @traceability-table provides the pre-specification record, tracing each requirement back to its pain point and interview material, while @coverage-table @requirements-without-prototype-coverage[and] provide the post-specification record, mapping requirements forward to prototype screens and accounting for those left unimplemented.



=== Requirements Prioritization
Prioritization techniques differ mainly in how much they demand of the team using them. Reviewing the field, @achimugu2014systematic find that pairwise methods such as the Analytic Hierarchy Process become impractical as requirement counts grow, and that cost-value approaches depend on effort and benefit estimates unavailable at this stage of a project. MoSCoW asks for neither, sorting requirements into four ordinal classes on judgement alone, which suits a small team working to a fixed deadline on requirements that have not been validated. The criteria used for that sorting are set out in @prioritization-scheme.





== Academia-Industry Collaboration

=== Collaboration friction as an established phenomenon
Collaboration between universities and companies has been studied extensively, and the difficulties it produces are documented rather than incidental.  @uniindustry2015systematic synthesise a fragmented body of work into a process framework covering why the two sides collaborate, the forms collaboration takes, and the organisational obstacles that recur across national contexts. Coordination and communication problems appear throughout that literature, independent of country, discipline and collaboration format. Since this problem is documented across many institutions, the difficulties reported in @stakeholder-needs are treated as a specific case of it rather than as a local peculiarity.


=== Barriers and information asymmetry between stakeholder groups
@barriers2010universityindustry separate two kinds of barrier to university-industry collaboration. Orientation-related barriers arise from differences in what each side is trying to achieve and on what timescale. Transaction-related barriers arise from the mechanics of working together, including administration and intellectual property. Prior collaboration experience reduces the first kind, while trust between the parties reduces both. Difficulties such as identifying the right contact person or establishing what expertise is available fall into the second category, which is where a platform can plausibly intervene. This distinction is used in @cross-cutting-findings to organise the pain points that recur across stakeholder groups.


=== Divergent motivations of academic and industry partners
The two sides enter collaboration for different reasons. @academicengagement2013 show that academic engagement is driven largely by research-related motives, including access to data, funding and problems worth studying, while firms pursue capability, talent and commercial application. Neither set of motives is illegitimate, but they are not automatically aligned, and the semester rhythm that governs university work rarely matches company project timelines. A platform mediating between the two therefore cannot assume a shared objective; it has to make each side's constraints legible to the other. @cross-cutting-findings returns to this point where the mismatch surfaced in the interview data.


=== Platforms and intermediaries as a category of solution
Where two parties struggle to find and evaluate each other, a third party can lower the cost of doing so. @intermediation2006 develops a typology of innovation intermediaries and defines them as bodies acting as brokers between parties in the innovation process, performing functions such as scanning, matchmaking and coordination. The platform specified in this document sits in that category, with the difference that it serves three groups rather than two.


#pagebreak()
= Research Approach and Limitations 

== Interview Methodology

The study followed a sequential design. The requirements engineering literature
reviewed in Section 2.1 informed the interview guide, and a scoping discussion
with BirdVision fixed what the client needed from the study. Stakeholder groups
were then defined, participants recruited and interviews conducted. Responses
were consolidated into a single matrix, analysed by group, and translated into
requirements, from which the prototype, the traceability table, the use case
diagrams and the key user flows were produced.

Interviews were semi-structured, using a common guide across all groups so that
responses stayed comparable, with follow-up questions free to depart from it
wherever a participant raised something unanticipated. The guide covered four
areas:

+ *Current collaboration experience* --- what forms of collaboration the
  participant had taken part in, and how they found them.
+ *Motivation* --- what makes collaboration worth entering, and what makes a
  project attractive.
+ *Problems and barriers* --- what goes wrong during collaboration, and what
  prevents people from engaging at all.
+ *Platform and solution needs* --- asked last, so that earlier answers were not
  framed around a software solution.

Only the last area concerns the platform directly. The first three establish how
collaboration currently works and why it is difficult, and are reported in
Section 5 independently of the specification.

Four stakeholder groups were distinguished: students, companies, professors and
university staff. Staff were separated from professors because their role is
administrative rather than academic, and their pain points proved to differ
accordingly. Participants were recruited through campus contacts and, for most
company representatives, at Career Factory; Section 3.2 discusses the resulting
composition and limitations.


Responses were recorded in a matrix with participants as columns and the four
areas as rows, allowing each theme to be read across all participants and across
groups. Section 3.3 describes how the requirements were derived from it.




== Sample Composition and Limitations

Twenty-six semi-structured interviews were conducted across four stakeholder
groups. Appendix B lists all participants; the distribution is summarised below.

#figure(
  table(
    columns: (auto, auto, auto),
    align: (left, center, left),
    stroke: 0.5pt,
    [*Group*], [*n*], [*Institutional background*],
    [Students], [13], [9 TUM Heilbronn, 2 TUM Garching, 1 RWTH Aachen,
                       1 Reutlingen],
    [Companies], [5], [Startup, industrial manufacturing, software,
                       energy management, IT services],
    [Professors and \ researchers], [6], [2 TUM Heilbronn, 1 TUM Munich, 1 RWTH Aachen,
                        1 Koblenz, 1 Passau],
    [University staff], [2], [2 TUM Heilbronn],
  ),
  caption: [Interview sample by stakeholder group],
)

The sample spans five universities. Eight of the 21 university-affiliated
participants are based outside TUM Campus Heilbronn, so where the same
difficulties recur across institutions, they are unlikely to be local artefacts.

Two limitations shape how the company findings should be read. Most company
representatives were recruited at Career Factory, a university--company event on
the Bildungscampus, so the sample includes no firms that have never collaborated
with a university or have stopped doing so. More importantly, four of the five
hold roles in human resources, apprenticeship management or campus relations.
Their interest in the university is oriented towards recruiting, and the
requirements derived from this group reflect that. Needs around research
cooperation, confidentiality and intellectual property are under-represented.
The founder interviewed as C1 offers a partial counterweight, having neither a
recruiting function nor an employer-branding budget, and is treated in Section 6
as a contrasting case rather than as one observation among five.

The company, professor and staff groups are small, and findings specific to them
are treated as indicative. The staff group is smallest at two, though both are
the administrators who currently run the project-study process at TUM Campus
Heilbronn, so the group covers the relevant population rather than a sample of
it.

// Finally, all interviews took place in a setting where university--industry
// collaboration is already well resourced and organisationally supported.
// Participants describe their needs in a context where university-industry engagement already exists. Therefore, the data does not provide enough evidence to identify requirements for settings where such engagement has not yet been established.

This background of existing engagement is unevenly distributed across the
sample. Several students and professors interviewed had no established route
into university--industry collaboration, so their accounts include the
perspective of those outside it. All five company representatives, by contrast,
were already engaged with universities at the time of the interview. The
company data therefore describes how engagement works for firms that have
already committed to it, and says little about what would bring in a firm that
has not.


== From Interview Insights to Requirements (how findings were translated, requirements framed as informed proposals, not validated findings)

The analysis started from the response matrix described above. Each theme was
read across all 26 participants, first within a stakeholder group and then
across groups, and recurring statements were grouped into pain points. Pain
points named by only one group are reported under that group in Section 5, while
those raised by more than one group are reported once among the cross-cutting
findings at the end of that section. Each pain point lists the participants who
raised it, so a reader can see how many independent sources stand behind it.

Requirements were then derived from these pain points. The two sets do not match
one to one. Some pain points lie outside what a platform can fix, and those are
accounted for in Section 9. Some requirements, in turn, come from elsewhere.
Each requirement therefore states what kind of evidence it rests on:

#figure(
  table(
    columns: (auto, 1fr),
    align: (left + top, left + top),
    stroke: 0.5pt,
    inset: 7pt,
    [*Basis*], [*Meaning*],
    [Interview],
    [Taken from one or more interview statements, cited by participant ID.],
    [Process documentation],
    [Taken from how the project-study process currently works at TUM Campus
     Heilbronn, rather than from interview data.],
    [Design decision],
    [A choice made by the authors, where neither source supplied a requirement.
     Listed individually, with reasons, in Section 10.],
  ),
  caption: [Evidence basis recorded for each requirement],
)


// / Interview: taken from one or more interview statements, cited by participant
//   ID.
// / Process documentation: taken from how the project-study process currently
//   works at TUM Campus Heilbronn, rather than from interview data.
// / Design decision: a choice made by the authors, where neither source supplied a
//   requirement. These are listed individually, with reasons, in Section 10.

Two further attributes are recorded and feed the prioritization scheme in
Section 6: whether the underlying pain point recurs across groups, and whether
the requirement depends on TUM's administrative arrangements or would apply at
any university.

The prototype was built from the requirement set as a whole rather than
requirement by requirement. The mapping from requirement to screen in Section 9
was therefore drawn up after implementation, not before it.

Two limits follow. The requirements were never taken back to participants for
confirmation, and the step from interview statement to pain point rests on the
authors' reading of the material. Together with the sample limitations described
above, this is why the requirements in Sections 6 and 7 are presented as
informed proposals. Each one can be traced to its evidence, and the strength of
that evidence is recorded, but none has been checked against the people it came
from.


#pagebreak()
= Overall Description 


== Product Perspective 

The platform is a new, self-contained system rather than an extension of
existing university software. It acts as an intermediary among parties who
currently find one another through scattered institute pages, personal contacts,
job boards and events, and its purpose is to reduce the cost of that search and
standardise the information exchanged once contact is made.

What exists at the end of this project study is a prototype. It demonstrates the
interfaces and flows specified here, but implements no persistent storage, no
authentication against university identity systems and no integration with
existing institutional processes. 


== Stakeholder Groups, Roles and Motivations


- *Students:* search for projects, apply and carry out the work, motivated by
  practical experience, industry contact and, in several cases, employment
  prospects. Their engagement is conditional --- several said they would
  withdraw from a project seen as serving only a commercial interest.

- *Companies:* post projects and receive results, motivated by talent contact,
  access to expertise and usable outcomes. The companies interviewed were
  oriented mainly towards recruiting, and the requirements derived from them
  reflect that.

- *Professors and academic researchers:* supervise and assess projects, motivated
  by access to real problems and by teaching value. Their constraint is time.

- *University staff:* administer the process, matching requests to supervisors and
  tracking progress. Their main obstacle is obtaining timely responses from
  professorships.

// #set terms(hanging-indent: 1.5em, spacing: 0.9em)
// / Students: search for projects, apply and carry out the work, motivated by
//   practical experience, industry contact and, in several cases, employment
//   prospects. Their engagement is conditional --- several said they would
//   withdraw from a project seen as serving only a commercial interest.

// / Companies: post projects and receive results, motivated by talent contact,
//   access to expertise and usable outcomes. The companies interviewed were
//   oriented mainly towards recruiting, and the requirements derived from them
//   reflect that.

// / Professors and academic researchers: supervise and assess projects, motivated
//   by access to real problems and by teaching value. Their constraint is time.

// / University staff: administer the process, matching requests to supervisors and
//   tracking progress. Their main obstacle is obtaining timely responses from
//   professorships.



These motivations are not aligned by default. The platform does not assume they
are; its function is to make each group's constraints visible to the others.


== Assumptions and Constraints 

The specification assumes a university runs the platform, not a commercial third
party. This matters because several requirements depend on the operator being
able to confirm that a profile really does belong to a member of the university,
and only the university itself holds that information. We further assume that
every user has an affiliation which can be verified, and that each project study
runs to a timeline agreed between the supervising professor and the company
rather than to a fixed institutional calendar.

There is one more assumption, about how selection currently works. Students at
the TUM Global Center for Family Enterprise are chosen by the university alone,
with no involvement from the companies whose projects they apply to. Section 6
contains a requirement that would change this. We have flagged it there as a
proposed change to the process rather than presenting it as something the
platform merely automates.

Our constraints were those of a single-semester project study, with no budget
and a small team. Everything here rests on interview data. We could not consult
institutional process documentation beyond what participants described to us,
and nobody with legal expertise reviewed the data-protection and confidentiality
questions that operating such a platform would raise.



== Scope Boundary: TUM-Specific Focus (explicit justification: administrative/collaboration processes differ significantly across universities, so single-institution depth was prioritized over shallow generality) 

The platform is specified against one process in particular: the project study
process at TUM Campus Heilbronn. Administrative arrangements vary a great deal
between universities, and a specification broad enough to fit all of them would
be too vague to build from. We chose depth against a process we could examine
closely.

The problems it addresses are another matter. We modeled a local workflow, but
the difficulties it responds to came up at every university in our sample.



== Transferability to Other Institutions (brief discussion of what would need to adapt for other universities) 

Each requirement is tagged according to how far it depends on local
arrangements:

#figure(
  table(
    columns: (auto, 1fr),
    align: (left + top, left + top),
    stroke: 0.5pt,
    inset: 7pt,
    [*Tag*], [*Meaning*],
    [Generalizable], [Would apply at any university.],
    [Adaptable], [Depends on an arrangement other institutions also have in some
      form; needs reconfiguring rather than redesigning.],
    [Institution-specific], [Tied to how TUM Campus Heilbronn organises the
      process; would require rework elsewhere.],
  ),
  caption: [Transferability tags applied to requirements],
)

These tags feed the prioritization scheme in Section 6.1: requirements that are
generalizable and grounded in cross-cutting pain points rank above those that
are institution-specific or supported by a single group.




== Out-of-Scope Items (e.g. backend functionality not prototyped)
Outside the scope of this specification and the prototype: persistent storage
and backend services, authentication against university identity providers,
automated student--project matching, contract and intellectual-property
handling, integration with university administration systems, and how the
platform would acquire its first users on each of the three sides.

#pagebreak()
= Stakeholder Needs (Pain Points) <stakeholder-needs>

The pain points in this chapter are derived from semi-structured interviews conducted across three primary stakeholder groups relevant to the project study process. Each pain point is presented with the interview ID it was sourced from. See appendix 11.B for anonymized interview counts per stakeholder group and matching interview IDs.
BirdVision's primary interest with this project study was gaining insight into industry-academia collaborations as a whole, particularly the stakeholders' motivations and the problems they encounter. The interviews were accordingly conducted on the broader premise of industry-academia collaborations, in order to gather as wide a range of insights as possible. However, as the stated aim of the project is a platform supporting project studies specifically, and the scope of the platform is limited, not every pain point identified applies directly to the project study process, or to TUM in particular. These findings are nonetheless documented in full below.




== Student Pain Points <student-pain-points>
=== Discoverability
Students consistently report that there is no clear, centralized listing for company projects. Project opportunities are described as scattered across fragmented institute websites or buried in static job boards (S6, S7, S8).

=== Missing or insufficient listing information
Project information about workload, technical requirements, deliverables, and whether the company genuinely prioritizes the project's outcome is frequently unavailable before applying (S8, S9). Company name, expected outcomes, and required skills were independently named as the minimum information needed to make an informed decision (S7, S9). 

=== Communication and responsiveness
Slow communication loops and vague project scope were named as reasons a student would abandon an application outright (S8). Separately, students report response delays during the application process and a lack of feedback following rejection (S12, S13).

=== Language barrier
German-language requirements were named as a disadvantage for international students on multiple, independent occasions (S5, S7, S10).

=== Team formation
A student named the inability to find a team as something that would stop them from applying altogether, and separately requested an automated team-matching feature (S10).

=== Application process friction
One student described having to repeatedly re-enter the same information across each company's own application platform, alongside generic, under-informed initial screening and a lack of feedback after rejection (S1). A separate student reported that project details were withheld pre-NDA, leading to a fundamentally different understanding of the task once disclosed (S9). Yet another student described the challenges they faced in finding an academic supervisor for their company project (S12).

=== Value and goal alignment
Several students indicated they would disengage from a project perceived as serving only the company's commercial interest without genuine educational or research value (S6, S8). This pattern recurs across other stakeholder groups and is developed further in Section 5.4. 





== Professor/University Pain Points 
=== Information standardization
Professors report that companies frequently fail to provide sufficiently detailed project briefs, desired area of expertise, objective, and data availability, leaving task scope unclear for both supervisor and student (P3, P4, P6). 

=== Contact and coordination burden
Locating appropriate contacts and coordinating a collaboration was named as time-consuming and requiring substantial advance planning (P1). On the administrative side, obtaining a timely response from professorships regarding supervision requests was named as the primary obstacle encountered by university staff coordinating intake (U1, U2).

=== Students' engagement with supervisors during the project
One professor observed that students frequently under-communicate with their academic supervisor once a company relationship is underway, directly linking this to reduced outcome quality, and has introduced mandatory monthly check-ins as an informal mitigation (P4).

=== Outcome measurement
Two different professors reported that there is no formal mechanism for assessing whether the effort invested in a project study was proportionate to its value. One describes this as entirely unmeasured, the other as narrative rather than KPI-based (P1, P5). This pattern recurs in Section 5.4. 

=== Resource pressure
Time and financial resources dedicated to these collaborations were named as the first budget item companies tend to cut, constraining the professor's ability to sustain partnerships (P5).


== Company Pain Points

=== Contact identification and structural complexity
Identifying the correct contact person and aligning expectations, timelines, and available resources was the most frequently cited difficulty (C3, C4). University structures were separately described as complex and inconsistent between institutions (C4), directly reinforcing the transferability discussion in Section 4.4-4.5.
=== Missing information when searching for partners
Companies report a lack of visibility into contact details, areas of expertise, ongoing projects, and collaboration opportunities (C4), as well as the absence of a clear overview of available posting/collaboration options (C5).

=== Output quality and delivery friction
For one company, the central concern was not access to universities but the practical usability of delivered outcomes, compounded by software-tooling mismatches between student and company environments (C2). A second company reported an inability to assess student or study quality in advance, which discourages deeper engagement. (C5).

=== Need for trust and verification
Companies want assurance that student and professor profiles are genuinely affiliated with their stated institution, citing existing third-party verification services elsewhere as a reasonable precedent (C4).

=== Screening signal degradation
One company noted that student CVs are increasingly perceived as AI-generated and therefore less reliable as a screening tool, expressing a preference for more direct channels, including contact with student clubs, over formal university structures (C3).




== Cross-Cutting Findings (pain points recurring across all three groups) <cross-cutting-findings>

=== Contact-person and reachability breakdown
Identifying and reaching the correct person was named independently by professors (P1), companies (C3, C4), and university staff (U2, U3). It is the most broadly and heavily evidenced finding in the dataset, spanning three stakeholder groups.

=== Bidirectional information insufficiency
Every stakeholder group reports the same underlying gap directed at a different counterpart: students want more complete project information from companies and professors (S7, S9); professors want companies to provide more structured project detail (P3); companies want more visibility into student and professor profiles, expertise, and ongoing activity (C4). The specific direction differs but the pattern recurs across all three groups.

=== Academia-industry goal misalignment
This is the most substantively supported cross-cutting finding. The university research staff perspective names it directly (U1), one company frames it as their central complaint about output usability (C2), a second names it explicitly as a reason to disengage (C4), and it recurs independently across multiple students, either as a disengagement trigger (S6) or as lived experience (S8, S11).

=== Outcome quality
Two professors report no formal mechanism for evaluating whether a project study delivered proportionate value (P1, P5); this connects directly to one company's independent complaint that project studies deliver limited usable insight (C2) and another professor's complaint that outcome quality is highly dependent on student engagement (P4).

=== Slow or unresponsive communication
Named as an application-ending concern by students (S8, S12, S13) and, from the opposite side of the same process, as staff's core administrative obstacle in obtaining professor responses (U2, U3).



#pagebreak()
= Functional Requirements <functional-requirements>





== Prioritization Scheme (MoSCoW, criteria defined here. Requirements grounded in cross-cutting pain points and structurally independent of TUM-specific administration are prioritized higher) <prioritization-scheme>
Requirements are prioritized using MoSCoW (Must, Should, Could, Won't), a judgement-based scheme, which is suited to the context of this project. Priority is assigned according to two criteria, applied in the following order: 1) Structural necessity. A requirement is Must-priority if the core application-to-supervision workflow cannot operate from start to finish without it. This holds true no matter how many interviews support it directly. 2) Strength of evidence. Among the requirements that are not structurally necessary, those founded on a cross-cutting finding or supported across multiple interviews are ranked as Should. Requirements based on a single citation, a team decision, or those that meet a narrower need are ranked as Could. Requirements that are clearly out of scope are marked as Won't in Section 4.6.

Transferability (Section 4.5) is noted for each requirement, but it does not influence this prioritization. The two attributes address different questions, and a requirement can do well in one without doing well in the other.

== Access Features
=== FR-1, Role-Based Access (Must)  
There are four different login/user types: Student, Company, Professor, and Staff. Each type has a unique dashboard. Although no interview explicitly requested this, every stakeholder-specific feature depends on it. Without separate roles, the platform cannot display different information to different users. This makes it a necessary requirement rather than an optional addition.
Source: Process Documentation (design decision, structural) 



== Company Features

=== FR-2, Company Project Submission Portal (Must)  
The following fields are required: Project Title, Required Area of Expertise, Project Background and Objective, Project Deliverable, Available Company Resources, Required Student Skills, Group Size, Company Contact Person. This is adapted from the current project proposal sheet.  
Source: S7, S8, S9, P3, P4, P6 

=== FR-3, Submission Review and Approval (Should)  
New project submissions will be marked as 'pending'. Staff will approve them before professors can see them.  
Source: Process Documentation  

=== FR-4, Company Browse Student Topics (Must)  
Companies can browse topics submitted by students
Source: C5  





== Professor Features
=== FR-5, Professor Profiles and Expertise Matching (Should)  
Professor profiles will display their chair and area of expertise, sourced from institution logins. When logged in, professors will see project entries matched to their expertise.  
Source: P3, P4, U1, U2  
=== FR-6, Professor Supervision Take-on (Must)  
To accept a project submitted by a company, the professor must provide chair contact information, application deadlines, and required documents. Once submitted, the project will be visible to students.  
Source: Process Documentation  
=== FR-7, Direct Project Submission (Should)  
When a professor and a company agree directly on a project study, the professor will submit it with the required fields filled in for students to apply.  
Source: Process Documentation  

== Student Features

=== FR-8, Student Project Submission Portal (Must)  
The mandatory fields include: Areas of Expertise, Research Interests, Skills, Previous Projects, Availability, and Contact Information.  
Source: C2, C4, C5, S12  
=== FR-9, Student Profiles (Should)  
Student profiles will list their program or degree, sourced from institution logins. This will help match students with teams and allow professors and companies to filter students by their program.  
Source: Team Decision  
=== FR-10, Student Team Matching (Could)  
A student can set their profile status to 'seeking teammates' and include a short message and contact information. Profiles can be filtered by this status.  
Source: S10  
=== FR-11, Student Browse Available Projects and Apply (Must)  
Students can view available projects with complete information, including company details, expertise required, application deadlines, skills needed, and contact person. They can also apply for a given entry by submitting the required documents.
Source: S6, S7, S8, S9  
=== FR-12, Application Status Visibility (Should)
Students will see a simple accepted/rejected status for each application.  
Source: S1  


== General Features
=== FR-13, Status-Change Notifications (Should)  
Automated notifications, such as emails, will be sent when an application's status changes or when a listing closes.  
Source: S8, U1, U2  
=== FR-14, Lightweight Progress Check-in (Could)  
A simple check-in mechanism will allow interaction between students and supervisors during the project.  
Source: P4  
=== FR-15, Dual Approval (Professor + Company) (Could)  
A student's application will require approval from both the professor and the company before it is finalized. At TUM Campus Heilbronn, the selection of students is currently handled solely by the university, with no formal role for companies in reviewing individual applicants. This proposed change aims to give companies input on who joins their projects, which could lead to higher satisfaction with the outcomes. However, this change may slow down the process and add a coordination step between professors and companies, which are recognized costs of the benefit.  
Source: Team Decision  
=== FR-16, Manual Multi-Offer Decision (Should)  
If a student is accepted to multiple projects, they will manually confirm one and withdraw from the others. This follows from FR-13 and FR-16: once the application statuses are real, a student accepting two projects simultaneously is a situation the platform must manage.  
Source: Process Documentation 

== Administrative Staff Features
=== FR-17, Staff Master Dashboard (Should)  
Staff will be able to view all project studies across every status: pending, approved, not yet supervised, ongoing, and filled.  
Source: U1, U2  
=== FR-18, Filter Incoming Submissions (Should)  
Staff will have the ability to filter and search incoming company submissions during reviews. The volume of submissions will scale with FR-3. Filtering will ensure that manual reviews do not become bottlenecks.  
Source: Process Documentation  



















#pagebreak()
= Non-Functional Requirements 
== Usability 
== Security and Data Privacy 
== Maintainability / Extensibility



#pagebreak()
= System Models 

== Use Case Diagram(s) 
== Key User Flows


#pagebreak()
= Traceability and Prototype Alignment <traceability-prototype-alignment>

== Traceability Table: Interview Insight → Pain Point → Requirement ID <traceability-table>
== Prototype Coverage Table: Screen → Requirement ID  <coverage-table>
== Pain Points Without Requirements and Requirements Without Prototype Coverage (brief justification)<requirements-without-prototype-coverage>




#pagebreak()
= Assumptions, Risks, and Open Issues



= Appendices 


= Declaration of authorship



// --- References ---

#set page(
	paper: "a4",
	margin: (top: 20mm, bottom: 20mm, left: 25mm, right: 20mm),
)
// #heading(level: 1, numbering: none)[References]
// #lorem(30)

// This was already noted by
// // pirates long ago. @article

// Multiple sources say ...
// // @article @article.

// // #bibliography("works.bib")

#bibliography("works.bib", title: "References", style: "apa")