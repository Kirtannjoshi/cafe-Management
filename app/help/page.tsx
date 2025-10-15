"use client"

import { Sidebar } from "@/components/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useStore } from "@/lib/store"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, HelpCircle, FileText, Mail, MessageCircle, Phone, Book, Coffee, Keyboard } from "lucide-react"
import { useState } from "react"

export default function HelpPage() {
  const { cafeSettings } = useStore()
  const [searchQuery, setSearchQuery] = useState("")

  // FAQ data
  const faqs = [
    {
      question: "How do I create a new order?",
      answer: "To create a new order, go to the Orders page and click on the 'Add Order' button in the top right corner. Fill in the customer details, select the order type, and add items from the menu. Finally, click 'Create Order' to save it."
    },
    {
      question: "How do I change the currency used in the system?",
      answer: "To change the currency, navigate to the Settings page. In the General Settings tab, you can select your preferred currency from the dropdown menu (₹, $, or €). Don't forget to save your changes."
    },
    {
      question: "How do I add new staff members?",
      answer: "To add a new staff member, go to the Staff Management page and click the 'Add Staff' button. Fill in the required information like name, role, email, phone number, and shift details, then click 'Add Staff' to create the new entry."
    },
    {
      question: "How do I check inventory levels?",
      answer: "You can check inventory levels on the Inventory page. It displays all items with their current quantities and minimum stock levels. Items with low stock will be highlighted with warning indicators."
    },
    {
      question: "How do I generate reports?",
      answer: "Analytics reports can be accessed from the Analytics page. Here you can view sales data, revenue trends, popular items, and other metrics. Use the date filters to narrow down the data range for your reports."
    },
    {
      question: "How do I change the tax rate?",
      answer: "To change the tax rate, go to the Settings page. In the Billing Settings tab, you can update the tax rate percentage. This will automatically be applied to all new orders."
    },
    {
      question: "How do I add new menu items?",
      answer: "To add a new menu item, go to the Menu Management page and click on the 'Add Menu Item' button. Fill in the details like name, price, category and availability, then click Save."
    },
    {
      question: "How do I print receipts?",
      answer: "You can print receipts from the Orders page or the Billing page. Click on the specific order, then use the 'Print Receipt' button in the order details dialog."
    },
  ]

  // Filter FAQs based on search query
  const filteredFaqs = faqs.filter(faq => 
    searchQuery === "" || 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Help topics
  const helpTopics = [
    { title: "Orders & Billing", icon: FileText, description: "Learn how to manage orders and generate receipts" },
    { title: "Menu Management", icon: Coffee, description: "Guide to adding and updating menu items" },
    { title: "Staff & Schedules", icon: Book, description: "Managing staff accounts and scheduling shifts" },
    { title: "Inventory Control", icon: Keyboard, description: "Track and manage inventory items and suppliers" },
    { title: "Settings & Preferences", icon: HelpCircle, description: "Configure system settings and user preferences" },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
            <p className="text-muted-foreground mt-2">Find answers to frequently asked questions and get help</p>
          </div>

          {/* Search */}
          <Card className="border-none shadow-none bg-muted/40">
            <CardContent className="p-6">
              <div className="space-y-2 text-center">
                <h2 className="text-xl font-semibold">How can we help you?</h2>
                <p className="text-muted-foreground text-sm">Search for answers or browse the topics below</p>
                <div className="max-w-md mx-auto mt-4 relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search help topics..."
                    className="pl-9" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Help Topics and FAQs */}
          <Tabs defaultValue="faq">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="guides">User Guides</TabsTrigger>
              <TabsTrigger value="contact">Contact Support</TabsTrigger>
            </TabsList>
            
            <TabsContent value="faq" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>Quick answers to common questions about using the system</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Accordion type="single" collapsible className="w-full">
                    {filteredFaqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground">{faq.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                    {filteredFaqs.length === 0 && (
                      <p className="text-center py-6 text-muted-foreground">
                        No results found for "{searchQuery}". Try another search term.
                      </p>
                    )}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="guides" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                {helpTopics.map((topic, i) => (
                  <Card key={i} className="cursor-pointer hover:bg-muted/40 transition-colors">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <topic.icon className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">{topic.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{topic.description}</p>
                      <Button variant="link" className="p-0 h-auto mt-2" size="sm">
                        View guide →
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="contact" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                  <CardDescription>Get in touch with our support team for further assistance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                        <div className="p-2 rounded-full bg-primary/10 mb-2">
                          <Mail className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-medium">Email Support</h3>
                        <p className="text-sm text-muted-foreground">Send us an email and we'll get back to you within 24 hours</p>
                        <Button className="mt-2">
                          support@cafemanager.com
                        </Button>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                        <div className="p-2 rounded-full bg-primary/10 mb-2">
                          <MessageCircle className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-medium">Live Chat</h3>
                        <p className="text-sm text-muted-foreground">Chat with our support team in real-time during business hours</p>
                        <Button className="mt-2">
                          Start Chat
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Send us a message</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" placeholder="Your name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" placeholder="Your email address" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input id="subject" placeholder="What's this regarding?" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Input id="message" placeholder="How can we help you?" className="h-24" />
                      </div>
                      <Button>Submit Request</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Support Info */}
          <div className="bg-muted/40 rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="font-semibold text-lg">Need additional assistance?</h2>
              <p className="text-muted-foreground">Our support team is available Mon-Fri, 9 AM to 6 PM</p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+91 99887 66554</span>
              </Button>
              <Button className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span>Chat with Support</span>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}