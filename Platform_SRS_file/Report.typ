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

In this section we provide a review of industry and academic practices in requirements engineering, focusing on the elicitation of requirements from stakeholders. We describe the sources for our methodology, including the choice of standard, the interview-based elicitation method, and the literature on small-sample saturation. We also discuss traceability practices and prioritization schemes relevant to this project.


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

These thresholds provide a basis for assessing the 26 interviews conducted for this study rather than merely reporting their number. The student group, at 13 interviews, exceeds the code-saturation threshold reported by Hennink et al. and falls within the range Hagaman and Wutich associate with thematic convergence in a single group; the pain points reported for students in @student-pain-points can therefore be regarded as reasonably stable. The company, professor and university-staff groups, at 5, 5 and 3 interviews respectively, fall below every threshold cited above, and findings specific to them are correspondingly treated as indicative. The cross-cutting findings in @cross-cutting-findings, which draw on the full sample of 26, sit within the range associated with cross-group themes, though not at its upper end. Requirements are accordingly framed throughout as informed proposals rather than validated findings.


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

== Interview Methodology (stakeholder groups, question design) 

== Sample Overview and Limitations (explicit note on data thinness, especially company-side) 

== From Interview Insights to Requirements (how findings were translated, requirements framed as informed proposals, not validated findings)




#pagebreak()
= Overall Description 


== Product Perspective 
== Stakeholder Groups and Their Roles (students, professors/supervisors, companies) 
== Assumptions and Constraints 
== Scope Boundary: TUM-Specific Focus (explicit justification: administrative/collaboration processes differ significantly across universities, so single-institution depth was prioritized over shallow generality) 
== Transferability to Other Institutions (brief discussion of what would need to adapt for other universities) 
== Out-of-Scope Items (e.g. backend functionality not prototyped)



#pagebreak()
= Stakeholder Needs (Pain Points) <stakeholder-needs>
== Overview by Stakeholder Group 
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
== Requirements Without Prototype Coverage (brief justification) <requirements-without-prototype-coverage>




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