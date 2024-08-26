'use client'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Check, Code, Eye, MessageSquare, Zap } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import {
  Eye as EyeIcon,
  MessageSquare as MessageSquareIcon,
  Globe,
  Clock,
  RefreshCcw,
  AlertTriangle,
  Search,
  Zap as ZapIcon,
  MousePointer2,
  Code2,
  Bot,
  GitCompare
} from 'lucide-react'

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = (e: Event) => {
      e.preventDefault()
      const target = e.target as HTMLAnchorElement
      const id = target.getAttribute('href')?.slice(1)
      if (id) {
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }

    const links = document.querySelectorAll('a[href^="#"]')
    links.forEach(link => {
      link.addEventListener('click', handleScroll)
    })

    return () => {
      links.forEach(link => {
        link.removeEventListener('click', handleScroll)
      })
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center">
            <Link className="flex items-center space-x-2" href="/">
              <Image
                src={`/logo.png`}
                alt="Chaotic Logo"
                width={24}
                height={24}
                className="shrink-0"
              />
              <span className="font-bold">Chaotic</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium ml-6">
              <Link
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                href="#features"
              >
                Features
              </Link>
              <Link
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                href="#how-it-works"
              >
                How It Works
              </Link>
              <Link
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                href="#pricing"
              >
                Pricing
              </Link>
              <Link
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                href="#about"
              >
                About Us
              </Link>
              <Link
                className="transition-colors hover:text-foreground/80 text-foreground/60"
                href="#contact"
              >
                Contact
              </Link>
            </nav>
          </div>
          <div className="hidden md:flex flex-1 items-center justify-end space-x-2">
            <Button className="w-auto">Try Chaotic Free</Button>
            <Button variant="ghost" className="w-auto">
              Schedule a Demo
            </Button>
          </div>
          <button
            className="md:hidden z-50"
            type="button"
            aria-haspopup="dialog"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
            >
              <path
                d="M3 5H11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M3 12H16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              <path
                d="M3 19H21"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
            <span className="sr-only">Toggle Menu</span>
          </button>
        </div>
        <div
          className={`absolute top-full left-0 right-0 bg-white shadow-md transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden md:hidden`}
        >
          <nav className="container py-4 flex flex-col space-y-4">
            <Link
              className="text-sm font-medium hover:text-primary"
              href="#features"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              className="text-sm font-medium hover:text-primary"
              href="#how-it-works"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link
              className="text-sm font-medium hover:text-primary"
              href="#pricing"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              className="text-sm font-medium hover:text-primary"
              href="#about"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              className="text-sm font-medium hover:text-primary"
              href="#contact"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Button className="w-full">Try Chaotic Free</Button>
            <Button variant="outline" className="w-full">
              Schedule a Demo
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Web testing made simple for everyone
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  From English to automated tests in seconds. Catch bugs before
                  they reach production.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                  Try Chaotic Free
                </Button>
                <Button variant="outline">Schedule a Demo</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              How Chaotic Works
            </h2>
            <div className="mx-auto max-w-3xl">
              <video
                className="w-full h-auto rounded-lg shadow-xl"
                autoPlay
                loop
                muted
                playsInline
              >
                <source
                  src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              Key Features
            </h2>
            <FeaturesSection />
          </div>
        </section>
        <section
          id="how-it-works"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              How It Works
            </h2>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">
                  Write in Plain English
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Describe your test scenario using natural language
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">AI Generates Test</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Our AI converts your description into executable tests
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Run and Analyze</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Execute tests and get detailed reports with fix suggestions
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              Simple, Credit-Based Pricing
            </h2>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="flex flex-col p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-4">Starter Pack</h3>
                <p className="text-4xl font-bold mb-4">$49</p>
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    500 test credits
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    Basic reporting
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    Email support
                  </li>
                </ul>
                <Button className="mt-auto">Get Started</Button>
              </div>
              <div className="flex flex-col p-6 bg-primary text-primary-foreground rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-4">Pro Pack</h3>
                <p className="text-4xl font-bold mb-4">$199</p>
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2" />
                    2500 test credits
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2" />
                    Advanced reporting
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2" />
                    Priority support
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 mr-2" />
                    API access
                  </li>
                </ul>
                <Button className="mt-auto bg-white text-primary hover:bg-gray-100">
                  Get Started
                </Button>
              </div>
              <div className="flex flex-col p-6 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
                <p className="text-4xl font-bold mb-4">Custom</p>
                <ul className="mb-6 space-y-2">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    Custom credit packages
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    Dedicated support
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    On-premise option
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    Custom integrations
                  </li>
                </ul>
                <Button className="mt-auto">Contact Sales</Button>
              </div>
            </div>
          </div>
        </section>
        <section
          id="faq"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              Frequently Asked Questions
            </h2>
            <Accordion
              type="single"
              collapsible
              className="w-full max-w-3xl mx-auto"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger>What is Chaotic?</AccordionTrigger>
                <AccordionContent>
                  Chaotic is an AI-powered QA engineer that allows you to create
                  and run web tests using plain English.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Who is Chaotic for?</AccordionTrigger>
                <AccordionContent>
                  Chaotic is designed for product owners, project managers, and
                  non-technical team members, but its also valuable for
                  developers and QA engineers.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  Do I need coding experience to use Chaotic?
                </AccordionTrigger>
                <AccordionContent>
                  No, Chaotic is designed to be used without any coding
                  experience. You can create tests using natural language.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  What types of tests can Chaotic run?
                </AccordionTrigger>
                <AccordionContent>
                  Chaotic can perform visual regression testing, functional
                  testing, and can work with any web framework.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>
                  How does Chaotic handle dynamic content?
                </AccordionTrigger>
                <AccordionContent>
                  Chaotic uses smart wait handling to account for loading states
                  and dynamic content before running tests.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
        <section id="about" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              About Chaotic
            </h2>
            <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 mx-auto text-center">
              Chaotic is on a mission to revolutionize web testing by making it
              accessible to everyone, regardless of their technical background.
              Our AI-powered platform bridges the gap between product vision and
              technical implementation, enabling seamless collaboration across
              teams.
            </p>
          </div>
        </section>
        <section
          id="contact"
          className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800"
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
              Get in Touch
            </h2>
            <form className="max-w-[500px] mx-auto space-y-4">
              <Input placeholder="Your Name" />
              <Input type="email" placeholder="Your Email" />
              <Textarea placeholder="Your Message" />
              <Button className="w-full">Send Message</Button>
            </form>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2023 Chaotic. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

function FeaturesSection() {
  const features = [
    {
      title: 'Visual regression testing',
      description:
        'Catch visual changes automatically with pixel-perfect comparison.',
      icon: <EyeIcon className="w-6 h-6" />
    },
    {
      title: 'Test creation in plain English',
      description: 'Write tests using natural language, no coding required.',
      icon: <MessageSquareIcon className="w-6 h-6" />
    },
    {
      title: 'Framework-agnostic testing',
      description: 'Works with any web technology or framework.',
      icon: <Globe className="w-6 h-6" />
    },
    {
      title: 'Smart wait handling',
      description: 'Intelligently waits for dynamic content before testing.',
      icon: <Clock className="w-6 h-6" />
    },
    {
      title: 'Self-healing tests',
      description: 'Tests adapt to minor UI changes automatically.',
      icon: <RefreshCcw className="w-6 h-6" />
    },
    {
      title: 'Issue severity ranking',
      description: 'Prioritize issues based on their impact and urgency.',
      icon: <AlertTriangle className="w-6 h-6" />
    },
    {
      title: 'Root cause analysis',
      description: 'Get insights into why tests fail with fix suggestions.',
      icon: <Search className="w-6 h-6" />
    },
    {
      title: 'Fast Jest syntax checking',
      description: 'Quickly validate your test syntax for accuracy.',
      icon: <ZapIcon className="w-6 h-6" />
    },
    {
      title: 'Visual test designer',
      description: 'Create tests with an intuitive drag-and-drop interface.',
      icon: <MousePointer2 className="w-6 h-6" />
    },
    {
      title: 'Code view with editing',
      description: 'View and edit test code with syntax highlighting.',
      icon: <Code2 className="w-6 h-6" />
    },
    {
      title: 'AI Assistant Chatbot',
      description: 'Get help with test editing and explanations on demand.',
      icon: <Bot className="w-6 h-6" />
    },
    {
      title: 'Interactive Diff Viewer',
      description: 'Visualize and understand proposed changes easily.',
      icon: <GitCompare className="w-6 h-6" />
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  )
}

const Feature = ({
  title,
  description,
  icon,
  index
}: {
  title: string
  description: string
  icon: React.ReactNode
  index: number
}) => {
  return (
    <div
      className={cn(
        'flex flex-col lg:border-r py-10 relative group/feature dark:border-neutral-800',
        (index === 0 || index === 4 || index === 8) &&
          'lg:border-l dark:border-neutral-800',
        index < 8 && 'lg:border-b dark:border-neutral-800'
      )}
    >
      {index < 8 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 8 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-primary transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  )
}
