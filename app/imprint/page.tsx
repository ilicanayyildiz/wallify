import Header from '@/components/Header'

export const metadata = {
  title: "Imprint | Wallify",
  description: "Legal information and company details for Wallify."
};

export default function Imprint() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-white">Imprint</h1>
          <p className="text-gray-400 mb-16">Last updated: January 2025</p>
          
          <div className="space-y-12">
            <div>
              <h2 className="text-lg font-semibold mb-3 text-blue-400 border-b border-blue-400 pb-2">Operator of the Website</h2>
              <div className="space-y-3 text-gray-300 leading-relaxed">
                <p>REEVATE ACQUISITION LTD.</p>
                <p>Company Registration Number: 14201295</p>
                <p>Managing Director: Nadiri USLUGIL</p>
                <p>Email: info@wallify.com</p>
                <p>Legal address: Hamilton House, Mabledon Place, London, England, WC1H 9BB</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3 text-blue-400 border-b border-blue-400 pb-2">(1) Accountability for Content</h2>
              <p className="text-gray-300 leading-relaxed">
                We strive to create the content on our pages with the utmost care. However, we cannot guarantee the accuracy, completeness, or timeliness of the information provided. We are responsible for our own content as required by law, but we are not obligated to monitor third-party information transmitted or stored, nor investigate circumstances indicating illegal activities. Our obligations to remove or block illegal content, as mandated by law, remain unaffected.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3 text-blue-400 border-b border-blue-400 pb-2">(2) Accountability for Links</h2>
              <p className="text-gray-300 leading-relaxed">
              We are not responsible for the content of external links (third-party websites). At the time of linking, we did not find any violations. If we become aware of any legal infringements, we will promptly remove the link in question.              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3 text-blue-400 border-b border-blue-400 pb-2">(3) Copyright</h2>
              <p className="text-gray-300 leading-relaxed">
              The content of our web pages is protected under British copyright law. Unless explicitly permitted by law, any use, reproduction, or processing of copyrighted works on our website requires prior consent from the copyright holder. Reproductions are allowed only for private use and may not be used for commercial purposes. Unauthorized use of copyrighted materials may result in penalties.              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

