'use-client'
import Image from "next/image";
import ModeToggle from "@/components/mode-toggle";
import ChatInterface from '../components/chatinterface';

export default function Home() {
  return (
    <div className="items-center justify-items-center max-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <ChatInterface />
    </div>
  );
}
