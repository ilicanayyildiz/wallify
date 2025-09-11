'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import { Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { t, language } = useLanguage()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    setIsSubmitted(true)
    setTimeout(() => setIsSubmitted(false), 3000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-neutral-50 to-white dark:from-black dark:via-neutral-900 dark:to-black transition-colors duration-300">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 dark:from-blue-600/10 dark:to-purple-600/10"></div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-black via-blue-900 to-purple-900 dark:from-white dark:via-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
            {language === 'tr' ? 'İletişim' : 'Contact Us'}
          </h1>
          <p className="text-xl text-neutral-700 dark:text-neutral-300 max-w-3xl mx-auto mb-8">
            {language === 'tr' 
              ? 'Bir sorunuz mu var veya yardıma mı ihtiyacınız var? Sizden haber almayı çok isteriz. Bize bir mesaj gönderin, en kısa sürede yanıtlayalım.'
              : 'Have a question or need help? We\'d love to hear from you. Send us a message and we\'ll respond as soon as possible.'
            }
          </p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-black dark:text-white">
                  {language === 'tr' ? 'İletişime Geçin' : 'Get in Touch'}
                </h2>
                <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {language === 'tr' 
                    ? 'Size yardımcı olmak ve sorularınızı yanıtlamak için buradayız. Sizden haber almayı dört gözle bekliyoruz.'
                    : 'We\'re here to help and answer any questions you might have. We look forward to hearing from you.'
                  }
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-black dark:text-white mb-1">
                      {language === 'tr' ? 'E-posta' : 'Email'}
                    </h3>
                    <p className="text-neutral-700 dark:text-neutral-300">hello@wallify.com</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {language === 'tr' ? '24 saat içinde yanıtlayacağız' : 'We\'ll respond within 24 hours'}
                    </p>
                  </div>
                </div>


                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-black dark:text-white mb-1">Office</h3>
                    <p className="text-neutral-700 dark:text-neutral-300">Hamilton House, Mabledon Place</p>
                    <p className="text-neutral-700 dark:text-neutral-300">London, England, WC1H 9BB</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-black dark:text-white mb-1">Business Hours</h3>
                    <p className="text-neutral-700 dark:text-neutral-300">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-neutral-700 dark:text-neutral-300">Saturday: 10:00 AM - 4:00 PM</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white/80 dark:bg-neutral-800/80 rounded-2xl p-8 border border-neutral-200 dark:border-neutral-700">
              <h3 className="text-2xl font-bold mb-6 text-black dark:text-white">
                {language === 'tr' ? 'Bize Mesaj Gönderin' : 'Send us a Message'}
              </h3>
              
              {isSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-black dark:text-white mb-2">
                    {language === 'tr' ? 'Mesaj Gönderildi!' : 'Message Sent!'}
                  </h4>
                  <p className="text-neutral-700 dark:text-neutral-300">
                    {language === 'tr' 
                      ? 'Bizimle iletişime geçtiğiniz için teşekkürler. En kısa sürede size dönüş yapacağız!'
                      : 'Thank you for contacting us. We\'ll get back to you soon!'
                    }
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2 text-black dark:text-white">
                        {language === 'tr' ? 'Ad *' : 'Name *'}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-black dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder={language === 'tr' ? 'Adınız' : 'Your name'}
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2 text-black dark:text-white">
                        {language === 'tr' ? 'E-posta *' : 'Email *'}
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-black dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2 text-black dark:text-white">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing Question</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2 text-black dark:text-white">
                      {language === 'tr' ? 'Mesaj *' : 'Message *'}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-black dark:text-white placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                      placeholder={language === 'tr' ? 'Size nasıl yardımcı olabileceğimizi söyleyin...' : 'Tell us how we can help you...'}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-600 dark:to-purple-600 hover:from-blue-600 hover:to-purple-600 dark:hover:from-blue-700 dark:hover:to-purple-700 text-black dark:text-white font-semibold rounded-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    {language === 'tr' ? 'Mesaj Gönder' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-white/50 dark:bg-neutral-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-black dark:text-white">Frequently Asked Questions</h2>
            <p className="text-xl text-neutral-700 dark:text-neutral-300">
              Can't find what you're looking for? Here are some common questions and answers.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white/80 dark:bg-neutral-800/80 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
              <h3 className="text-xl font-bold mb-3 text-black dark:text-white">How do I download wallpapers?</h3>
              <p className="text-neutral-700 dark:text-neutral-300">
                Simply browse our collection, select a wallpaper you like, and click the download button. 
                You'll need credits to download, which you can purchase from our pricing page.
              </p>
            </div>
            
            <div className="bg-white/80 dark:bg-neutral-800/80 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
              <h3 className="text-xl font-bold mb-3 text-black dark:text-white">What file formats do you support?</h3>
              <p className="text-neutral-700 dark:text-neutral-300">
                We offer wallpapers in multiple resolutions including HD (1920x1080), 4K (3840x2160), 
                and 8K (7680x4320). All files are in high-quality JPG format.
              </p>
            </div>
            
            <div className="bg-white/80 dark:bg-neutral-800/80 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
              <h3 className="text-xl font-bold mb-3 text-black dark:text-white">Can I use wallpapers commercially?</h3>
              <p className="text-neutral-700 dark:text-neutral-300">
                Yes! All our wallpapers come with a commercial license, so you can use them in your 
                business projects, websites, and marketing materials.
              </p>
            </div>
            
            <div className="bg-white/80 dark:bg-neutral-800/80 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
              <h3 className="text-xl font-bold mb-3 text-black dark:text-white">How do I get a refund?</h3>
              <p className="text-neutral-700 dark:text-neutral-300">
                We offer a 30-day money-back guarantee on all credit purchases. If you're not satisfied, 
                contact our support team and we'll process your refund.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
