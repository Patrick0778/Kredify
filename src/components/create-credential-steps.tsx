import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Check, Upload, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

interface CredentialMetadata {
  name: string;
  image: string;
  mediaType: string;
  [key: string]: unknown;
}

export function CreateCredentialSteps() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [transactionSent, setTransactionSent] = useState(false);
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);
  const [credentialMetadata, setCredentialMetadata] =
    useState<CredentialMetadata | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [mintError, setMintError] = useState<string | null>(null);

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("http://localhost:3000/files/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        setUploadedFile(file);
        // Save IPFS hash and metadata for later minting
        setIpfsHash(data.ipfsHash);
        setCredentialMetadata(data.metadata);
      } catch (err) {
        alert("Upload failed");
      }
      setIsUploading(false);
    }
  };
  // const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     setIsUploading(true)
  //     const file = e.target.files[0]

  //     // Simulate upload delay
  //     setTimeout(() => {
  //       setUploadedFile(file)
  //       setIsUploading(false)
  //     }, 1500)
  //   }
  // }

  const handleSubmit = async () => {
    setIsMinting(true);
    setMintError(null);
    try {
      // TODO: Replace with your actual recipient address logic
      const recipientAddress = "addr1..."; // Get from wallet connect or user input
      const res = await fetch("http://localhost:3000/mint/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          policyScriptPath: "C:/absolute/path/to/compiled_policy.cbor", // Update as needed
          tokenName: `CredentialNFT-${Date.now()}`,
          metadata: credentialMetadata,
          recipientAddress,
        }),
      });
      if (!res.ok) throw new Error("Minting failed");
      const data = await res.json();
      setTransactionHash(data.txHash);
      setTransactionSent(true);
    } catch (err) {
      if (err instanceof Error) {
        setMintError(err.message);
      } else {
        setMintError("Minting failed");
      }
    }
    setIsMinting(false);
  };

  const steps = [
    { id: 1, name: "Document Upload", icon: <Upload className="h-5 w-5" /> },
    { id: 2, name: "Metadata", icon: <FileText className="h-5 w-5" /> },
    { id: 3, name: "Preview", icon: <Eye className="h-5 w-5" /> },
    { id: 4, name: "Mint", icon: <Wallet className="h-5 w-5" /> },
  ];

  return (
    <Tabs defaultValue="steps" className="w-full max-w-3xl mx-auto">
      <TabsList className="grid w-full grid-cols-4">
        {steps.map((step) => (
          <TabsTrigger
            key={step.id}
            value={`step-${step.id}`}
            className={
              currentStep >= step.id
                ? "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                : ""
            }
            disabled={currentStep < step.id}
            onClick={() => currentStep >= step.id && setCurrentStep(step.id)}
          >
            <span className="flex items-center gap-2">
              {currentStep > step.id ? (
                <Check className="h-4 w-4" />
              ) : (
                step.icon
              )}
              <span className="hidden md:inline">{step.name}</span>
            </span>
          </TabsTrigger>
        ))}
      </TabsList>

      <div className="mt-6">
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Upload Document</CardTitle>
              <CardDescription>
                Upload the document you want to mint as a credential
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center border-2 border-dashed p-12 text-center">
                {!uploadedFile ? (
                  <>
                    <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold">
                        Drag and drop or click to upload
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Supports PDF, PNG, JPG (max 10MB)
                      </p>
                    </div>
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      <Button disabled={isUploading} className="relative">
                        {isUploading ? "Uploading..." : "Select File"}
                        <Input
                          id="file-upload"
                          type="file"
                          className="sr-only"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={handleFileUpload}
                          disabled={isUploading}
                        />
                      </Button>
                    </Label>
                  </>
                ) : (
                  <div className="flex flex-col items-center">
                    <FileText className="h-10 w-10 text-primary mb-4" />
                    <h3 className="text-lg font-semibold">
                      {uploadedFile.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setUploadedFile(null)}
                    >
                      Remove File
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleNextStep} disabled={!uploadedFile}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Credential Metadata</CardTitle>
              <CardDescription>
                Add important information about your credential
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="title">Credential Title</Label>
                  <Input
                    id="title"
                    placeholder="E.g. Bachelor of Science in Computer Science"
                  />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="type">Credential Type</Label>
                  <Select defaultValue="degree">
                    <SelectTrigger>
                      <SelectValue placeholder="Select credential type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="degree">Degree</SelectItem>
                      <SelectItem value="certificate">Certificate</SelectItem>
                      <SelectItem value="diploma">Diploma</SelectItem>
                      <SelectItem value="award">Award</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="issuer">Issuing Institution</Label>
                  <Input id="issuer" placeholder="E.g. ABC University" />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="date">Issue Date</Label>
                  <Input id="date" type="date" />
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide details about this credential..."
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePrevStep}>
                Back
              </Button>
              <Button onClick={handleNextStep}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Preview Credential</CardTitle>
              <CardDescription>
                Review your credential before minting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-6">
                <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-6">
                  <FileText className="h-16 w-16 text-muted-foreground" />
                </div>

                <div className="grid gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Title
                    </div>
                    <div>Bachelor of Science in Computer Science</div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Type
                    </div>
                    <div>Degree</div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Issuer
                    </div>
                    <div>ABC University</div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Issue Date
                    </div>
                    <div>April 15, 2023</div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Description
                    </div>
                    <div className="text-sm">
                      This credential certifies that the holder has completed
                      all requirements for the Bachelor of Science in Computer
                      Science program at ABC University.
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="text-sm font-medium text-muted-foreground">
                      Document Hash
                    </div>
                    <div className="font-mono text-xs truncate">
                      8a3df7894d2b3c1e6a9f7b2c8d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePrevStep}>
                Back
              </Button>
              <Button onClick={handleNextStep}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {currentStep === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Mint Credential as NFT</CardTitle>
              <CardDescription>
                Complete the credential minting process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border rounded-lg p-4">
                  <div className="text-sm font-medium mb-2">
                    Transaction Details
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Network Fee:</div>
                    <div className="font-mono">0.17 ₳</div>
                    <div className="text-muted-foreground">Deposit:</div>
                    <div className="font-mono">2.00 ₳</div>
                    <div className="text-muted-foreground">Total:</div>
                    <div className="font-mono">2.17 ₳</div>
                  </div>
                </div>

                {transactionSent ? (
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-cardano-green/20 flex items-center justify-center mb-4">
                      <Check className="h-6 w-6 text-cardano-green" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">
                      Transaction Submitted
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your credential is being minted on the Cardano blockchain
                    </p>
                    <div className="font-mono text-xs bg-muted p-2 rounded w-full overflow-hidden text-ellipsis text-center">
                      Tx:
                      8f4d2b3c1e6a9f7b2c8d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center">
                    <Wallet className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-lg font-semibold mb-4">
                      Ready to mint credential
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your wallet will prompt you to approve this transaction
                    </p>
                    <Button onClick={handleSubmit}>Mint Credential</Button>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {!transactionSent && (
                <Button variant="outline" onClick={handlePrevStep}>
                  Back
                </Button>
              )}
              {transactionSent && (
                <div className="w-full flex justify-center">
                  <Button variant="outline" asChild>
                    <Link to="/dashboard">View All Credentials</Link>
                  </Button>
                </div>
              )}
            </CardFooter>
          </Card>
        )}
      </div>
    </Tabs>
  );
}

// For the icons in the component
function FileText(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  );
}

function Eye(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
