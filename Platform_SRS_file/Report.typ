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


= Literature review

In this section, the document reviews the industry and academic practices of requirements engineering, focusing on the elicitation of requirements from stakeholders. It describes the sources for our methodology, including the choice of standard, the interview-based elicitation method, and the literature on small-sample saturation. It also discusses traceability practices and prioritization schemes relevant to this project.


== Requirements Engineering Grounding


=== Choice of standard (29148 over 830)
This specification follows ISO/IEC/IEEE 29148:2018 @IEEE29148_2018, the current international standard for requirements engineering, which supersedes IEEE 830-1998 @IEEE830_1998. The predecessor addressed the specification document alone, whereas 29148 covers the requirements process as a whole, including elicitation, analysis and validation. This is the more suitable frame here, since much of what follows concerns how requirements were derived from stakeholder interviews and how strongly each is supported. The standard is applied in scaled-down form appropriate to a single-semester project and extended with a literature review section to meet the academic requirements of a project study report.

=== Interview-based elicitation as a method
Semi-structured interviews were used to explore stakeholder needs without assuming predefined system requirements. Ferrari et al. (2022) @ferrari2022requirementsevolveelicitationempirical show that interviews support an iterative elicitation process in which stakeholder initial ideas are progressively clarified and refined into requirements through the dialogue and iterative feedback. Accordingly, this project first analyzed interview data inductively to identify recurring needs and pain points, which then served as the basis for deriving platform requirements.

=== Small sample / thematic saturation
How many interviews are enough is a recurring question in qualitative research, and it is usually answered by reference to saturation. Guest, Bunce and Johnson (2006) @guest2006many found that little new information emerged after the first 12 of their 60 interviews. Hennink, Kaiser and Marconi (2017) @hennink2017code argue that the answer depends on what saturation is taken to mean. No new codes appeared in their data after 9 interviews, but arriving at a rich understanding of those codes took between 16 and 24. These figures come from fairly uniform groups of participants. Hagaman and Wutich (2017) @hagaman2017crosscultural worked across 4 sites and found that 16 interviews or fewer sufficed within a single group, while themes running across groups needed 20 to 40.

These thresholds provide a basis for assessing the 26 interviews conducted for this study rather than merely reporting their number. The student group, at 13 interviews, exceeds the code-saturation threshold reported by Hennink et al. and falls within the range Hagaman and Wutich associate with thematic convergence in a single group; the pain points reported for students in @student-pain-points can therefore be regarded as reasonably stable. The company, professor and university-staff groups, at 5, 5 and 3 interviews respectively, fall below every threshold cited above, and findings specific to them are correspondingly treated as indicative. The cross-cutting findings in @cross-cutting-findings, which draw on the full sample of 26, sit within the range associated with cross-group themes, though not at its upper end. Requirements are accordingly framed throughout as informed proposals rather than validated findings.


=== Traceability practices

Requirements traceability is the ability to follow a requirement forward into design and implementation and backward to the source it came from. Gotel and Finkelstein (1994) @traceability1994, drawing on interviews and questionnaires with over 100 practitioners, distinguish these two directions and argue that the backward one is where projects usually fail. Post-specification traceability, linking requirements to what was built from them, is comparatively well supported by tools. Pre-specification traceability, linking a requirement back to the stakeholder statement and rationale that produced it, tends to be neglected, and most of the problems attributed to poor traceability turn out to originate there. //Section 9 is structured around this backward direction, recording for each requirement the pain point and interview material it derives from, before mapping it forward to the prototype.

@traceability-prototype-alignment is organised along both directions: @traceability-table provides the pre-specification record, tracing each requirement back to its pain point and interview material, while @coverage-table @requirements-without-prototype-coverage[and] provide the post-specification record, mapping requirements forward to prototype screens and accounting for those left unimplemented.



=== Prioritization schemes
Prioritisation techniques differ mainly in how much they demand of the team using them. Reviewing the field, Achimugu et al. (2014) @achimugu2014systematic find that pairwise methods such as the Analytic Hierarchy Process become impractical as requirement counts grow, and that cost-value approaches depend on effort and benefit estimates unavailable at this stage of a project. MoSCoW asks for neither, sorting requirements into four ordinal classes on judgement alone, which suits a small team working to a fixed deadline on requirements that have not been validated. The criteria used for that sorting are set out in @prioritization-scheme.





== Academia-Industry Collaboration
- *The core premise of your whole project:* that project-study-type collaborations between students, professors, and companies suffer from coordination/communication friction -- this needs to be an established phenomenon in the literature, not just something your interviews happened to find. Otherwise your findings look like isolated anecdotes rather than an instance of a known pattern.
- *Information asymmetry between stakeholder groups specifically:* since this is your central design idea, literature on knowledge transfer barriers or boundary-spanning roles in university-industry projects would directly support why "who do I contact" and "what expertise is needed" are recurring failure points, not TUM-specific quirks.
- *Differing motivations of academic vs. industry partners:* this is worth citing given your own framing -- BirdVision wanting insights, your supervisor wanting a concrete deliverable is itself a small instance of the "divergent goals in academia-industry collaboration" pattern the literature discusses. Citing this gives you academic cover to explicitly name that tension in Section 1 or 2, rather than leaving it implicit.
- *Platform/intermediary-based solutions:* since your output is a platform, literature on digital intermediaries or matching platforms reducing coordination costs in institutional collaboration would support the category of solution you chose, not just its specific features.




= Research Approach and Limitations 

== Interview Methodology (stakeholder groups, question design) 

== Sample Overview and Limitations (explicit note on data thinness, especially company-side) 

== From Interview Insights to Requirements (how findings were translated, requirements framed as informed proposals, not validated findings)





= Overall Description 


== Product Perspective 
== Stakeholder Groups and Their Roles (students, professors/supervisors, companies) 
== Assumptions and Constraints 
== Scope Boundary: TUM-Specific Focus (explicit justification: administrative/collaboration processes differ significantly across universities, so single-institution depth was prioritized over shallow generality) 
== Transferability to Other Institutions (brief discussion of what would need to adapt for other universities) 
== Out-of-Scope Items (e.g. backend functionality not prototyped)




= Stakeholder Needs (Pain Points) 
== Overview by Stakeholder Group 
== Student Pain Points <student-pain-points>
== Professor/University Pain Points 
== Company Pain Points
== Cross-Cutting Findings (pain points recurring across all three groups) <cross-cutting-findings>





= Functional Requirements <functional-requirements>


== Prioritization Scheme (MoSCoW, criteria defined here. Requirements grounded in cross-cutting pain points and structurally independent of TUM-specific administration are prioritized higher) <prioritization-scheme>
== [Functional Area 1] 
== [Functional Area 2] 
== [Functional Area 3] 
== [Functional Area 4] 





= Non-Functional Requirements 
== Usability 
== Security and Data Privacy 
== Maintainability / Extensibility




= System Models 

== Use Case Diagram(s) 
== Key User Flows



= Traceability and Prototype Alignment <traceability-prototype-alignment>

== Traceability Table: Interview Insight → Pain Point → Requirement ID <traceability-table>
== Prototype Coverage Table: Screen → Requirement ID  <coverage-table>
== Requirements Without Prototype Coverage (brief justification) <requirements-without-prototype-coverage>



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

#bibliography("works.bib", title: "References")