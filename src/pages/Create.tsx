import { useState } from "react";
import { CreateCredentialSteps } from "@/components/create-credential-steps";

export default function Create() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      alert("Please upload a file before submitting.");
      return;
    }

    // TODO: Implement file upload logic here
    console.log("File ready for upload:", selectedFile);
  };

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Create New Credential</h1>
          <p className="text-muted-foreground">
            Mint your achievements as verifiable credentials on the Cardano blockchain
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Upload Credential (Image or PDF)</label>
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-gray-300 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit
        </button>

        <CreateCredentialSteps />
      </div>
    </div>
  );
}
