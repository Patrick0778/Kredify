
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"

interface CredentialCardProps {
  title: string
  issuer: string
  date: string
  type: string
  status: "verified" | "pending" | "revoked"
  className?: string
}

export function CredentialCard({
  title,
  issuer,
  date,
  type,
  status,
  className,
}: CredentialCardProps) {
  return (
    <Card className={cn("card-hover overflow-hidden relative", className)}>
      {status === "verified" && (
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[50px] border-r-[50px] border-t-transparent border-r-cardano-green" />
      )}
      {status === "pending" && (
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[50px] border-r-[50px] border-t-transparent border-r-cardano-yellow" />
      )}
      {status === "revoked" && (
        <div className="absolute top-0 right-0 w-0 h-0 border-t-[50px] border-r-[50px] border-t-transparent border-r-cardano-red" />
      )}
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="line-clamp-2">{title}</CardTitle>
        </div>
        <div className="text-sm text-muted-foreground">{issuer}</div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex justify-between items-center mb-3">
          <div className="bg-primary/10 text-primary w-12 h-12 rounded-full flex items-center justify-center">
            <FileText className="h-6 w-6" />
          </div>
          <Badge variant={
            status === "verified" ? "default" : 
            status === "pending" ? "outline" : 
            "destructive"
          }>
            {status}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-xs text-muted-foreground">{type}</div>
        <div className="text-xs text-muted-foreground">{date}</div>
      </CardFooter>
    </Card>
  )
}
