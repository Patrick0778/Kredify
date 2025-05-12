
import { CredentialCard } from "@/components/credential-card"

export function CredentialGrid() {
  // Mock credential data - in a real app, this would come from an API or context
  const credentials = [
    {
      id: "1",
      title: "Bachelor of Computer Science",
      issuer: "ABC University",
      date: "2023-04-15",
      type: "Degree",
      status: "verified" as const
    },
    {
      id: "2",
      title: "Advanced Machine Learning Certificate",
      issuer: "Tech Institute",
      date: "2023-06-20",
      type: "Certificate",
      status: "verified" as const
    },
    {
      id: "3",
      title: "Blockchain Developer Certification",
      issuer: "Cardano Foundation",
      date: "2023-09-10",
      type: "Certificate",
      status: "pending" as const
    },
    {
      id: "4",
      title: "Project Management Professional",
      issuer: "PMI",
      date: "2022-11-05",
      type: "Certificate",
      status: "revoked" as const
    },
    {
      id: "5",
      title: "Outstanding Achievement Award",
      issuer: "ABC Championship",
      date: "2024-01-30",
      type: "Award",
      status: "verified" as const
    },
    {
      id: "6",
      title: "Mobile App Development Course",
      issuer: "Tech Academy",
      date: "2024-02-15",
      type: "Course",
      status: "verified" as const
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {credentials.map((credential) => (
        <CredentialCard
          key={credential.id}
          title={credential.title}
          issuer={credential.issuer}
          date={credential.date}
          type={credential.type}
          status={credential.status}
        />
      ))}
    </div>
  )
}
