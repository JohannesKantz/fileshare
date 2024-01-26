import FileUploader from "@/components/FileUpload/FileUploader";

export default function Home() {
    return (
        <>
            <main className="flex flex-col items-center justify-between">
                <FileUploader />
            </main>
        </>
    );
}
