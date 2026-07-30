"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Mail, MapPin, Phone } from "lucide-react"
import { JOBS, PHONE, PHONE_TEL, SERVICE_CITY } from "@/lib/junk-data"

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [prefilledAddress, setPrefilledAddress] = useState("")
  const [selectedJob, setSelectedJob] = useState("")
  const [loadSize, setLoadSize] = useState("")
  const searchParams = useSearchParams()

  useEffect(() => {
    const address = searchParams.get("address")
    const job = searchParams.get("job")
    const size = searchParams.get("lowLbs")
    if (address) setPrefilledAddress(address)
    if (job) setSelectedJob(job)
    if (size) setLoadSize(size)
  }, [searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
  }

  const serviceAreas = [
    "Charlotte",
    "Matthews",
    "Mint Hill",
    "Pineville",
    "Huntersville",
    "Cornelius",
    "Davidson",
    "Concord",
    "Harrisburg",
    "Indian Trail",
    "Waxhaw",
    "Fort Mill",
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-brand-band-soft border-b border-line-soft py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-flame/15 mb-4">
            <Truck className="w-7 h-7 text-flame" />
          </div>
          <h1 className="disp text-ink text-[clamp(28px,4vw,44px)] mb-4">Tell Us About the Job</h1>
          <p className="text-body max-w-2xl mx-auto">
            A whole-property cleanout, a heavy debris load, or anything past the weight the
            estimator quotes online? Send us the details and a crew lead will price it for you.
          </p>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Request a Custom Quote</CardTitle>
                  <CardDescription>
                    Tell us what you&apos;ve got and we&apos;ll get back to you within one business day.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!formSubmitted ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first-name">First name</Label>
                          <Input id="first-name" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-name">Last name</Label>
                          <Input id="last-name" required />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input id="phone" type="tel" required />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Pickup Address</Label>
                        <Input id="address" defaultValue={prefilledAddress} required />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="job">What are we hauling?</Label>
                          <select
                            id="job"
                            defaultValue={selectedJob}
                            /* text-base below md matches Input/Textarea: iOS
                               Safari zooms the whole page in on focus when a
                               control's text is under 16px. */
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base md:text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          >
                            <option value="">Select a job type</option>
                            {JOBS.map((j) => (
                              <option key={j.id} value={j.id}>{j.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="load-size">Rough size or weight</Label>
                          <Input id="load-size" type="text" defaultValue={loadSize} placeholder="e.g. a packed two-car garage" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Anything else we should know?</Label>
                        <Textarea id="message" rows={4} placeholder="Item list, where it's located, stairs or gate access, timing constraints..." />
                      </div>
                      <Button type="submit">Request My Quote</Button>
                    </form>
                  ) : (
                    <div className="py-12 text-center space-y-4">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-flame/10 mb-2">
                        <Mail className="w-7 h-7 text-flame" />
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold">Thanks, we&apos;ve got it.</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        A crew lead will reach out within one business day to confirm the details
                        and give you an all-in price.
                      </p>
                      <Button onClick={() => setFormSubmitted(false)} variant="outline">
                        Submit Another Request
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 mt-0.5 text-flame" />
                    <div>
                      <p className="font-medium">Service Area</p>
                      <p className="text-sm text-muted-foreground">{SERVICE_CITY}</p>
                      <p className="text-sm text-muted-foreground">& Surrounding Areas</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 mt-0.5 text-flame" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <a href={PHONE_TEL} className="text-sm text-flame hover:underline">{PHONE}</a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Service Areas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {serviceAreas.map((area) => (
                      <div key={area} className="text-sm text-muted-foreground">
                        {area}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
