"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, Check, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface CSVUploadProps {
  label: string
  description: string
  onUpload: (content: string) => void
  uploaded?: boolean
}

export function CSVUpload({ label, description, onUpload, uploaded }: CSVUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      if (!file.name.endsWith(".csv")) {
        setError("Please upload a CSV file")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setFileName(file.name)
        setError(null)
        onUpload(content)
      }
      reader.onerror = () => {
        setError("Failed to read file")
      }
      reader.readAsText(file)
    },
    [onUpload],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    maxFiles: 1,
  })

  return (
    <div
      {...getRootProps()}
      className={`relative border border-dashed rounded-xl p-4 transition-all cursor-pointer ${
        isDragActive
          ? "border-foreground bg-muted/50"
          : uploaded
            ? "border-foreground bg-muted/30"
            : error
              ? "border-red-400 bg-red-50"
              : "border-border hover:border-muted-foreground bg-background"
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex items-center gap-3">
        <AnimatePresence mode="wait">
          {uploaded ? (
            <motion.div
              key="success"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="w-9 h-9 rounded-full bg-foreground flex items-center justify-center flex-shrink-0"
            >
              <Check className="w-4 h-4 text-background" />
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0"
            >
              <X className="w-4 h-4 text-red-600" />
            </motion.div>
          ) : (
            <motion.div
              key="upload"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="w-9 h-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0"
            >
              <Upload className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">{description}</p>
          {fileName && !error && <p className="text-xs text-foreground mt-0.5 font-medium truncate">{fileName}</p>}
          {error && <p className="text-xs text-red-600 mt-0.5">{error}</p>}
        </div>
      </div>
    </div>
  )
}
