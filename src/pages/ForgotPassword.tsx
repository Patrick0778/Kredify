
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // This would be replaced with actual password reset logic when connected to Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      setEmailSent(true);
      toast({
        title: "Reset link sent",
        description: "Check your email for a link to reset your password."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error sending the reset link.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Forgot password</CardTitle>
          <CardDescription>
            {emailSent 
              ? "Check your email for a reset link"
              : "Enter your email and we'll send you a reset link"
            }
          </CardDescription>
        </CardHeader>
        {!emailSent ? (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email"
                    type="email" 
                    placeholder="Enter your email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending reset link..." : "Send reset link"}
              </Button>
              <p className="text-center text-sm mt-4">
                <Link to="/login" className="font-medium text-primary underline underline-offset-4">
                  Back to sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        ) : (
          <CardContent className="space-y-4">
            <div className="text-center p-4">
              <Mail className="h-12 w-12 mx-auto mb-4 text-primary" />
              <p className="mb-2">We've sent a password reset link to:</p>
              <p className="font-medium break-all">{email}</p>
              <p className="mt-4 text-sm text-muted-foreground">
                Didn't receive an email? Check your spam folder or
                <br />
                <Button variant="link" className="p-0 h-auto" onClick={() => setEmailSent(false)}>
                  try another email address
                </Button>
              </p>
            </div>
            <div className="flex justify-center">
              <Button asChild variant="outline">
                <Link to="/login">Back to sign in</Link>
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
