#import "@preview/cuti:0.4.0": fakebold

// #import "@preview/wordometer:0.1.5": word-count, total-words

// #show: word-count




// #set page(
// 	paper: "a4",
// 	margin: (top: 20mm, bottom: 20mm, left: 25mm, right: 20mm),
// )
#set page(
	paper: "a4",
	margin: (top: 20mm, bottom: 20mm, left: 20mm, right: 2mm),
)

#set text(font: "Arial Unicode MS")

#set par(leading: 0.95em)  // smaller global line spacing

#let tum_blue = rgb("0065BD")

// --- Content placeholders ---
#let essay_title = "Software Requirements Specification for a Collaboration Platform for Project Studies"
#let essay_subtitle = "Report for Project Study"
#let author_name = "Nan Jiang"
#let examiner_name = "Prof. Dr. Miriam Bird"
#let supervisor_name="Lorenz Tidow"
#let submited_date="16.08.2026"

// --- Header ---
#grid(
	columns: (140mm, auto),
	align: (left, top),
	gutter: 2mm,
)[
	#block[
		#set text(size: 10pt, fill: tum_blue)
		#set par(leading: 0.4em)  // tighter header spacing
		Chair of Entrepreneurship and Family Enterprise \
		TUM School of Management \
		Technical University of Munich
	]
][
	#image("Universitaet_Logo_RGB.pdf", height: 10mm),
]

#v(22mm)

// --- Title Section ---
#text(size: 20pt, fakebold(essay_title))
#v(2mm)

// #text(size: 14pt)[#essay_subtitle]
#box(width: 165mm)[
  #text(size: 14pt)[#essay_subtitle]
]

// #v(20mm)

#v(28mm)

#text(size: 16pt, fill: tum_blue, fakebold(author_name))

// #v(4mm)

// --- Degree Line ---
#block[
	#set text(size: 13pt)
	#set par(leading: 0.6em)
	*B.Sc. Management and Data Science* \
	at TUM School of Management of the Technical University of Munich
]

#text(size: 16pt, fill: tum_blue, fakebold(text[Jasmin Yalçın]))

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
	[
		#image("TUM_Uhrenturm.png", height: 105mm),
	],
	dx: -6mm,
	dy: 8mm
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

#set text(font: ("Times New Roman"), size: 12pt, lang: "en")
#set par(justify: true, leading: 1em, spacing: 1.5em)

// Footnotes: 10 pt, single spacing, justified
#show footnote.entry: it => {
  set text(size: 10pt)
  set par(leading: 0.65em, justify: true)
  it
}




#set heading(numbering: "1.")
#show heading: fakebold
#outline()


// #set page(
// 	paper: "a4",
// 	margin: (top: 20mm, bottom: 20mm, left: 25mm, right: 20mm),
// )
// #set text(size: 12pt)

#set page(
  paper: "a4",
  margin: (left: 2.5cm, right: 3cm, top: 2.5cm, bottom: 2.5cm),
)

#set text(font: ("Times New Roman"), size: 12pt, lang: "en")
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


== Requirements Engineering Grounding


- *Choice of standard (29148 over 830):* This specification follows ISO/IEC/IEEE 29148:2018 @IEEE29148_2018, the current international standard for requirements engineering, which supersedes IEEE 830-1998 @IEEE830_1998. The predecessor addressed the specification document alone, whereas 29148 covers the requirements process as a whole, including elicitation, analysis and validation. This is the more suitable frame here, since much of what follows concerns how requirements were derived from stakeholder interviews and how strongly each is supported. The standard is applied in scaled-down form appropriate to a single-semester project and extended with a literature review section to meet the academic requirements of a project study report.

- *Interview-based elicitation as a method:* Semi-structured interviews were used to explore stakeholder needs without assuming predefined system requirements. Ferrari et al. (2022) @ferrari2022requirementsevolveelicitationempirical show that interviews support an iterative elicitation process in which stakeholder initial ideas are progressively clarified and refined into requirements through the dialogue and iterative feedback. Accordingly, this project first analyzed interview data inductively to identify recurring needs and pain points, which then served as the basis for deriving platform requirements.

- *Small-sample / saturation literature:* this is probably your most useful citation. There's a body of work on thematic saturation (how many interviews are "enough" to start seeing repeated patterns) — citing this lets you say your sample, while small, isn't arbitrary; it lets you argue "we observed convergence on X pain point by interview 5" with a methodological backing, rather than just apologizing for n.


- *Traceability practices:* Section 9 assumes traceability matters — a citation on why requirements traceability is standard RE practice (and what goes wrong without it) turns that section from "our professor asked for this" into "this is recognized best practice, here's why."
- *Prioritization schemes:* you're choosing MoSCoW for Section 6.0 — citing why MoSCoW (vs. Kano, cost-value analysis, AHP) fits a small-team, exploratory, resource-constrained context justifies the choice rather than treating it as arbitrary/default.https://www.researchgate.net/publication/220630837_Time_boxing_planning_buffered_moscow_rules






== Academia-Industry Collaboration
== Positioning This Project Relative to the Literature





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
== Student Pain Points 
== Professor/University Pain Points 
== Company Pain Points
== Cross-Cutting Findings (pain points recurring across all three groups)





= Functional Requirements 


== Prioritization Scheme (MoSCoW, criteria defined here. Requirements grounded in cross-cutting pain points and structurally independent of TUM-specific administration are prioritized higher)
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



= Traceability and Prototype Alignment 

== Traceability Table: Interview Insight → Pain Point → Requirement ID
== Prototype Coverage Table: Screen → Requirement ID 
== Requirements Without Prototype Coverage (brief justification)



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