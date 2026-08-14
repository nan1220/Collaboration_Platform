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
== Stakeholder Groups, Roles and Motivations (students, professors/supervisors, companies) 
== Assumptions and Constraints 
== Scope Boundary: TUM-Specific Focus (explicit justification: administrative/collaboration processes differ significantly across universities, so single-institution depth was prioritized over shallow generality) 
== Transferability to Other Institutions (brief discussion of what would need to adapt for other universities) 
== Out-of-Scope Items (e.g. backend functionality not prototyped)



#pagebreak()
= Stakeholder Needs (Pain Points) <stakeholder-needs>

== Student Pain Points <student-pain-points>


== Professor/University Pain Points 



== Company Pain Points




== Cross-Cutting Findings (pain points recurring across all three groups) <cross-cutting-findings>




#pagebreak()
= Functional Requirements <functional-requirements>


== Prioritization Scheme (MoSCoW, criteria defined here. Requirements grounded in cross-cutting pain points and structurally independent of TUM-specific administration are prioritized higher) <prioritization-scheme>
== [Functional Area 1] 
== [Functional Area 2] 
== [Functional Area 3] 
== [Functional Area 4] 




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