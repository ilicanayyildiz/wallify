"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Lock } from "lucide-react"

interface CreditCardFormProps {
  onSubmit: (cardData: {
    pan: string
    expires: string
    holder: string
    cvv: string
  }) => void
  onCancel: () => void
  processing?: boolean
  credits: number
  amount: number
}

export function CreditCardForm({ 
  onSubmit, 
  onCancel, 
  processing = false, 
  credits, 
  amount 
}: CreditCardFormProps) {
  const [formData, setFormData] = useState({
    pan: '',
    expires: '',
    holder: '',
    cvv: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    
    // Add spaces every 4 digits
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiry = (value: string) => {
    // Remove all non-digits
    const v = value.replace(/\D/g, '')
    
    // Add slash after MM and format as MM/YYYY
    if (v.length >= 2) {
      if (v.length <= 6) {
        return v.substring(0, 2) + '/' + v.substring(2, 6)
      } else {
        return v.substring(0, 2) + '/' + v.substring(2, 6)
      }
    }
    
    return v
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    // Card number validation
    const cleanPan = formData.pan.replace(/\s/g, '')
    if (!cleanPan) {
      newErrors.pan = 'Kartennummer ist erforderlich'
    } else if (cleanPan.length < 16) {
      newErrors.pan = 'Kartennummer muss 16 Ziffern haben'
    }
    
    // Expiry validation for MM/YYYY format
    if (!formData.expires) {
      newErrors.expires = 'Ablaufdatum ist erforderlich'
    } else if (!/^\d{2}\/\d{4}$/.test(formData.expires)) {
      newErrors.expires = 'Ungültiges Ablaufdatum-Format (MM/JJJJ)'
    } else {
      // Additional validation for realistic month/year values
      const [month, year] = formData.expires.split('/')
      const monthNum = parseInt(month, 10)
      const yearNum = parseInt(year, 10)
      const currentYear = new Date().getFullYear()
      
      if (monthNum < 1 || monthNum > 12) {
        newErrors.expires = 'Ungültiger Monat (01-12)'
      } else if (yearNum < currentYear || yearNum > currentYear + 20) {
        newErrors.expires = 'Ungültiges Jahr'
      }
    }
    
    // Holder validation
    if (!formData.holder.trim()) {
      newErrors.holder = 'Karteninhabername ist erforderlich'
    }
    
    // CVV validation
    if (!formData.cvv) {
      newErrors.cvv = 'CVV ist erforderlich'
    } else if (formData.cvv.length < 3) {
      newErrors.cvv = 'CVV muss 3-4 Ziffern haben'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      // Clean card number for submission
      const cleanedData = {
        ...formData,
        pan: formData.pan.replace(/\s/g, '')
      }
      onSubmit(cleanedData)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    let processedValue = value
    
    if (field === 'pan') {
      processedValue = formatCardNumber(value)
    } else if (field === 'expires') {
      processedValue = formatExpiry(value)
    } else if (field === 'cvv') {
      processedValue = value.replace(/\D/g, '').substring(0, 4)
    }
    
    setFormData(prev => ({
      ...prev,
      [field]: processedValue
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Kreditkartenzahlung
        </CardTitle>
        <CardDescription>
          Kaufen Sie {credits} Credits für €{amount.toFixed(2)}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pan">Kartennummer</Label>
            <Input
              id="pan"
              type="text"
              placeholder="1234 5678 9012 3456"
              value={formData.pan}
              onChange={(e) => handleInputChange('pan', e.target.value)}
              maxLength={19}
              disabled={processing}
              className={errors.pan ? 'border-red-500' : ''}
            />
            {errors.pan && (
              <p className="text-sm text-red-500">{errors.pan}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expires">Ablaufdatum</Label>
              <Input
                id="expires"
                type="text"
                placeholder="MM/YYYY"
                value={formData.expires}
                onChange={(e) => handleInputChange('expires', e.target.value)}
                maxLength={7}
                disabled={processing}
                className={errors.expires ? 'border-red-500' : ''}
              />
              {errors.expires && (
                <p className="text-sm text-red-500">{errors.expires}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                type="text"
                placeholder="123"
                value={formData.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value)}
                maxLength={4}
                disabled={processing}
                className={errors.cvv ? 'border-red-500' : ''}
              />
              {errors.cvv && (
                <p className="text-sm text-red-500">{errors.cvv}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="holder">Karteninhabername</Label>
            <Input
              id="holder"
              type="text"
              placeholder="John Doe"
              value={formData.holder}
              onChange={(e) => handleInputChange('holder', e.target.value)}
              disabled={processing}
              className={errors.holder ? 'border-red-500' : ''}
            />
            {errors.holder && (
              <p className="text-sm text-red-500">{errors.holder}</p>
            )}
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
            <Lock className="h-4 w-4" />
            <span>Ihre Zahlungsinformationen sind sicher und verschlüsselt</span>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={processing}
              className="flex-1"
            >
              Abbrechen
            </Button>
            <Button
              type="submit"
              disabled={processing}
              className="flex-1"
            >
              {processing ? "Wird verarbeitet..." : `€${amount.toFixed(2)} bezahlen`}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 