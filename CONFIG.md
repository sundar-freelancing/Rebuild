Firestore Database
│
├── 📂 siteConfig (1 document — global site settings)
│ ├── whatsappNumber
│ ├── officeAddress
│ ├── mapEmbedUrl
│ ├── ceoName
│ ├── ceoPictureUrl ← (image stored in Firebase Storage)
│ ├── contactEmail
│ └── contactPhone
│
├── 📂 courses (collection — one doc per course)
│ ├── course1
│ │ ├── title
│ │ ├── description
│ │ ├── duration
│ │ ├── fee
│ │ ├── syllabus[]
│ │ └── thumbnailUrl
│ └── course2 ...
│
├── 📂 successStories (collection — one doc per student)
│ ├── story1
│ │ ├── studentName
│ │ ├── feedback
│ │ ├── imageUrl ← (stored in Firebase Storage)
│ │ ├── company
│ │ └── course
│ └── story2 ...
│
├── 📂 hiringPartners (collection — one doc per company)
│ ├── partner1
│ │ ├── companyName
│ │ ├── logoUrl ← (stored in Firebase Storage)
│ │ └── website
│ └── partner2 ...
│
└── 📂 leads (collection — already exists!)
└── ... (your existing lead capture data)
