// Lokasi: components/pages/enhanced-lesson-content-page.tsx

"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronLeft, BookOpen, Play, FileText, Calculator } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useProgress } from "@/contexts/progress-context"
import YouTubePlayer from "@/components/youtube-player"
import InteractiveExample from "@/components/interactive-example"
import { BlockMath } from "react-katex"
import LessonSlideViewer from "@/components/lesson-slide-viewer"
import PdfViewer from "@/components/pdf-viewer";
import type { Course } from "@/data/types"

export default function EnhancedLessonContentPage({ course }: { course: Course }) {
  const [activeTab, setActiveTab] = useState("materials")
  const { getProgress } = useProgress()
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string | null>(null); // State untuk PDF yang dipilih

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Lesson Not Found</h2>
        <Link href="/lessons">
          <Button>Back to Lessons</Button>
        </Link>
      </div>
    )
  }

  // Komponen untuk kartu materi
  const MaterialCard = ({ material }: { material: { name: string; url: string } }) => (
    <motion.div whileHover={{ y: -5 }}>
      <Card 
        className="bg-white/80 dark:bg-[#1b263b]/80 backdrop-blur-sm border-gray-200 dark:border-[#415a77]/30 hover:shadow-xl transition-all duration-300 group cursor-pointer"
        onClick={() => setSelectedPdfUrl(material.url)}
      >
        <CardHeader>
          <div className="flex items-center space-x-4">
            <FileText className="h-8 w-8 text-blue-500 dark:text-cyan-400" />
            <div>
              <CardTitle className="text-lg font-semibold group-hover:text-blue-600 dark:group-hover:text-cyan-400">{material.name}</CardTitle>
              <CardDescription>Click to open document</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
          <Link href={`/lessons/${course.topic.toLowerCase()}`} className="inline-flex items-center text-blue-600 dark:text-cyan-400 hover:underline mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to {course.topic}
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">{course.title}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{course.description}</p>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-300">Progress</span>
                <span className="text-gray-900 dark:text-white font-medium">{getProgress(course.id)}%</span>
              </div>
              <Progress value={getProgress(course.id)} className="h-2" />
            </div>
          </div>
        </motion.div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="materials" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-white/80 dark:bg-[#1b263b]/80 backdrop-blur-sm">
            <TabsTrigger value="materials" className="flex items-center space-x-2"><BookOpen className="h-4 w-4" /><span>Materials</span></TabsTrigger>
            <TabsTrigger value="video" className="flex items-center space-x-2"><Play className="h-4 w-4" /><span>Videos</span></TabsTrigger>
            <TabsTrigger value="examples" className="flex items-center space-x-2"><Calculator className="h-4 w-4" /><span>Examples</span></TabsTrigger>
            <TabsTrigger value="formulas" className="flex items-center space-x-2"><FileText className="h-4 w-4" /><span>Formulas</span></TabsTrigger>
          </TabsList>

          {/* --- PERUBAHAN LOGIKA PADA TAB MATERIALS --- */}
          <TabsContent value="materials">
            {selectedPdfUrl ? (
              // Tampilan PDF Viewer jika ada PDF yang dipilih
              <div>
                <Button onClick={() => setSelectedPdfUrl(null)} variant="outline" className="mb-4">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back to Materials
                </Button>
                <PdfViewer fileUrl={selectedPdfUrl} />
              </div>
            ) : (
              // Tampilan daftar kartu materi
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {course.materials && course.materials.filter(m => m.type === 'pdf').length > 0 ? (
                  course.materials.filter(m => m.type === 'pdf').map((material, index) => (
                    <MaterialCard key={index} material={material} />
                  ))
                ) : (
                  course.slides && course.slides.length > 0 ? (
                    // Fallback untuk menampilkan slide jika tidak ada PDF
                    <div className="col-span-full">
                      <LessonSlideViewer slides={course.slides} />
                    </div>
                  ) : (
                    <div className="col-span-full text-center py-20 text-gray-500">
                      Materi pelajaran untuk kursus ini belum tersedia.
                    </div>
                  )
                )}
              </div>
            )}
          </TabsContent>

          {/* Tab Video */}
          <TabsContent value="video">
            {course.videoPlaylist ? (
              <YouTubePlayer playlistId={course.videoPlaylist} title={course.title} />
            ) : (
              <div className="text-center py-20 text-gray-500">Video untuk kursus ini belum tersedia.</div>
            )}
          </TabsContent>

          {/* Tab Contoh Interaktif */}
          <TabsContent value="examples" className="space-y-6">
            {course.interactiveExamples && course.interactiveExamples.length > 0 ? (
              course.interactiveExamples.map((example, index) => (
                <InteractiveExample
                  key={index}
                  title={example.title}
                  description={example.description}
                  initialExpression={example.initialExpression}
                  steps={example.steps}
                />
              ))
            ) : (
              <div className="text-center py-20 text-gray-500">Contoh interaktif untuk kursus ini belum tersedia.</div>
            )}
          </TabsContent>

          {/* Tab Rumus Kunci */}
          <TabsContent value="formulas" className="space-y-6">
            {course.keyFormulas && course.keyFormulas.length > 0 ? (
              course.keyFormulas.map((section, index) => (
                <Card key={index} className="bg-white/80 dark:bg-[#1b263b]/80">
                  <CardHeader><CardTitle>{section.title}</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {section.formulas.map((formula: string, formulaIndex: number) => (
                      <div key={formulaIndex} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
                         <BlockMath math={formula} />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-20 text-gray-500">Rumus kunci untuk kursus ini belum tersedia.</div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}