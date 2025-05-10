import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import NavLinks from '@/components/nav-links';
import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
// import { ThemeProvider, useTheme } from 'next-themes'; // next-themes integration can be added later if full dark mode toggle is required

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'VisionCraft AI',
  description: 'AI-powered Object Detection Model Building Assistant',
};

// Simple theme toggle - for full featured use next-themes
// function ThemeToggle() {
//   // This is a placeholder. For a full theme toggle, use 'next-themes'
//   // const { theme, setTheme } = useTheme();
//   // For now, this button won't do anything functional without next-themes setup
//   return (
//     <Button variant="ghost" size="icon" onClick={() => console.log("Theme toggle clicked")}>
//       <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
//       <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
//       <span className="sr-only">Toggle theme</span>
//     </Button>
//   );
// }


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem> */}
          <SidebarProvider defaultOpen={true}>
            <Sidebar variant="sidebar" collapsible="icon">
              <SidebarHeader>
                <AppLogo />
              </SidebarHeader>
              <SidebarContent>
                <NavLinks />
              </SidebarContent>
              <SidebarFooter>
                {/* <ThemeToggle /> */}
              </SidebarFooter>
            </Sidebar>
            <SidebarInset>
              <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-2 md:hidden">
                <SidebarTrigger />
                <AppLogo />
              </header>
              <main className="flex-1 p-4 sm:p-6">
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>
          <Toaster />
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
