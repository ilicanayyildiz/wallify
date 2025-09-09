import Header from '@/components/Header'

export const metadata = {
  title: "User Agreement | Wallify",
  description: "Terms governing user accounts and platform usage on Wallify."
};

export default function UserAgreementPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-white">User Agreement</h1>
          <p className="text-gray-400 mb-16">Last updated: January 2025</p>
          
          <div className="space-y-8">
            <p className="text-gray-300 leading-relaxed">
              Welcome to Wallify! Access and use of the user portions of our website (the "Site") are provided to you under the condition that you accept the terms and conditions outlined in this User Agreement. By accessing or using the Site, you agree to these terms. If you do not agree, please refrain from accessing or using the Site.
            </p>
            <p className="text-gray-300 leading-relaxed">
              We may update this User Agreement at any time, with changes taking effect immediately upon posting on the Site. Your continued use of the Site constitutes your acceptance of any modifications. If at any time you disagree with the terms, you should immediately stop using the Site.
            </p>

            <div>
              <h2 className="text-lg font-semibold mb-3 text-blue-400 border-b border-blue-400 pb-2">1. Download Credits</h2>
              <p className="text-gray-300 leading-relaxed">
                You can purchase download credits via the Credit Purchase page on the Site. We accept payments through VISA, MasterCard, and alternative methods. The price of credits is specified at the time of your purchase, and by submitting payment details, you confirm that you are the authorized cardholder and that your billing information is accurate.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3 text-blue-400 border-b border-blue-400 pb-2">2. Use of Content</h2>
              <p className="text-gray-300 leading-relaxed">
                The Site contains content that is protected by intellectual property laws. You agree not to alter, reproduce, or distribute any content unless permitted by this User Agreement or a separate Content License Agreement. Content on the Site is provided through agreements between Wallify and its artists, and you may only download content in compliance with the applicable licenses.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3 text-blue-400 border-b border-blue-400 pb-2">3. Registration Data and Account Security</h2>
              <p className="text-gray-300 leading-relaxed">
                When you use the Site, you agree to provide accurate and up-to-date information during registration. You are responsible for maintaining the confidentiality of your account details and for all activity under your account. Notify Wallify immediately of any unauthorized use of your account.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3 text-blue-400 border-b border-blue-400 pb-2">4. Rules of Conduct</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                You agree to not use the Site for any unlawful purposes or in any way that may harm others or the Site. Specifically, you must not:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>Defame, abuse, or harass others.</li>
                <li>Upload or transfer unlawful, harmful, or inappropriate content.</li>
                <li>Engage in activities that could damage the Site or its systems.</li>
                <li>Use the Site to advertise or promote third-party goods or services without permission.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3 text-blue-400 border-b border-blue-400 pb-2">5. Managing Content</h2>
              <p className="text-gray-300 leading-relaxed">
                While Wallify does not review every piece of content posted, we reserve the right to remove or edit any content that violates this User Agreement. You are responsible for the content you upload, and Wallify may correct errors in content at its discretion.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3 text-blue-400 border-b border-blue-400 pb-2">6. Confidential Information</h2>
              <p className="text-gray-300 leading-relaxed">
                You agree to protect the confidentiality of Wallify's proprietary information, both during and after your use of the Site. This includes business models, financial information, designs, and other confidential data.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3 text-blue-400 border-b border-blue-400 pb-2">7. Indemnity</h2>
              <p className="text-gray-300 leading-relaxed">
                You agree to indemnify Wallify and its affiliates against any claims or losses arising from your use of the Site, including any breach of this User Agreement. Wallify reserves the right to defend any claims at your expense, and you must cooperate in the defense.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3 text-blue-400 border-b border-blue-400 pb-2">8. Term and Termination</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                This Agreement remains in effect until terminated. You can terminate it by notifying us at info@wallify.com. Wallify reserves the right to terminate your access to the Site for any reason without prior notice. Termination does not relieve you of any financial obligations.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Upon termination, you forfeit any remaining credits and must cease using the Site or any downloaded content in a manner not authorized under this Agreement.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3 text-blue-400 border-b border-blue-400 pb-2">9. DISCLAIMER OF WARRANTIES</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                The Site, including all content therein, is provided "as is" without any representation, warranty, or condition, either express or implied. This includes, but is not limited to, implied warranties of merchantability or fitness for a particular purpose. Wallify does not warrant that the Site or its content will meet your requirements, or that the Site will be uninterrupted or error-free.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Wallify does not guarantee that the Site or any content available for download will be free of viruses or other harmful elements.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3 text-blue-400 border-b border-blue-400 pb-2">10. LIMITATION OF LIABILITY</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                You assume all responsibility and risk for using the Site, including all content and information it contains.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                In no event will Wallify, or any of its directors, officers, employees, shareholders, partners, licensors, or agents be liable for any incidental, indirect, punitive, exemplary, or consequential damages (including loss of profits, business interruption, loss of business information, or any other financial loss) arising from any claim, loss, damage, action, suit, or proceeding related to this User Agreement, including your use of or reliance upon the Site, its content, or any rights granted hereunder, even if Wallify has been advised of the possibility of such damages.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                In any event, Wallify's total liability under this Agreement or in relation to the use of the Site and its content shall be limited to a maximum of five (5.00) Euros (EUR).
              </p>
              <p className="text-gray-300 leading-relaxed">
                Some jurisdictions may not allow for the limitation of liability for incidental or consequential damages, so the above limitation may not apply to you. In such cases, Wallify's liability will be limited to the greatest extent permitted by law.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3 text-blue-400 border-b border-blue-400 pb-2">11. Age and Responsibility</h2>
              <p className="text-gray-300 leading-relaxed">
                You represent that you are of legal age to use the Site and create binding legal obligations. You are responsible for all use of the Site under your account, including use by others, such as minors under your supervision.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3 text-blue-400 border-b border-blue-400 pb-2">12. Applicable law</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                The Site is operated and controlled by Wallify from Hamilton House, Mabledon Place, London, England, WC1H 9BB. It can be accessed from various countries worldwide, which may have different laws. By accessing the Site, you agree that this User Agreement will be governed by the laws of England, excluding conflict of laws principles. You submit to the exclusive jurisdiction of the courts located in London, for any disputes related to this Agreement.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Any disputes arising from this Agreement will be subject to arbitration in London, United Kingdom. If Wallify needs to go to court to enforce its rights, you agree to reimburse Wallify for any legal fees, costs, and disbursements if Wallify is successful.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3 text-blue-400 border-b border-blue-400 pb-2">13. General</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                You confirm that you have reviewed this User Agreement and any applicable Terms of Use and agree to be bound by them.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Wallify's failure to enforce strict performance of any provision does not waive its right to do so in the future.
              </p>
              <p className="text-gray-300 leading-relaxed">
                If any part of this User Agreement is found to be unenforceable, the parties will replace it with a legally enforceable provision that reflects the original intent. This Agreement is personal to you and is not transferable without Wallify's prior written consent. Wallify may assign this Agreement to another party without your consent, provided the new party agrees to its terms.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3 text-blue-400 border-b border-blue-400 pb-2">14. Contact</h2>
              <p className="text-gray-300 leading-relaxed">
                If you have any questions or concerns about the Site or this User Agreement, please contact us at info@wallify.com.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3 text-blue-400 border-b border-blue-400 pb-2">15. Acknowledgement</h2>
              <p className="text-gray-300 leading-relaxed">
                By using the Site, you acknowledge that you have read, understood, and agree to be bound by this User Agreement. This Agreement supersedes all prior discussions or agreements between you and Wallify concerning the subject matter of this Agreement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
