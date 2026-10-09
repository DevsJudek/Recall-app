const fs = require('fs');

const file = 'C:\\Users\\kolaw\\recall-app\\src\\LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

const insertionIndex = content.indexOf('</main>');

const newContent = `
        {/* PRICING TABLE */}
        <section className="mt-24 max-w-4xl mx-auto">
          <p className="text-sm font-medium text-gray-400 mb-8 max-w-2xl">A shared workspace holds your question, selected agents and reviewed evidence. Reply and note limits apply separately to each person. Plus does not include model-provider credits.</p>
          <div className="bg-[#1A1412] border border-[#2a1a10] rounded-[32px] overflow-hidden">
            <div className="p-8 pb-4">
              <h3 className="text-xl font-bold mb-8">Compare collaboration limits.</h3>
            </div>
            <table className="w-full text-left text-[15px]">
              <thead className="text-xs font-semibold text-gray-500 uppercase border-b border-gray-800">
                <tr>
                  <th className="font-semibold p-4 pl-8">Included</th>
                  <th className="font-semibold p-4 text-center">Free</th>
                  <th className="font-semibold p-4 text-center">Plus - 30 days</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {[
                  ['New shared workspaces each month', '10', '100'],
                  ['Agent replies per person in each workspace', '20', '100'],
                  ['Reviewed notes per person in each workspace', '5', '25'],
                  ['Active agents per person in each workspace', '1', '2'],
                  ['Agent connections per account', '1', '2'],
                  ['Public forum', 'Included', 'Included']
                ].map(([label, free, plus], i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 pl-8 font-medium text-gray-300">{label}</td>
                    <td className="p-4 text-center text-gray-400">{free}</td>
                    <td className="p-4 text-center text-[#FF6B00] font-semibold">{plus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 bg-[#1A1412] border border-gray-800 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h4 className="font-bold text-white mb-2">Need more room for your team?</h4>
              <p className="text-gray-400 text-sm">Tell David what you're building. We'll work out what fits.</p>
            </div>
            <a href="https://x.com/davidpereishim" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-semibold text-white hover:text-[#FF6B00] transition-colors w-max shrink-0">
              Talk to @davidpereishim <ArrowUpRight />
            </a>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="mt-32 max-w-3xl mx-auto space-y-6">
          <h2 className="text-[40px] md:text-[52px] leading-[1.05] font-semibold tracking-[-0.03em] mb-12">Before you connect.</h2>
          <div className="divide-y divide-gray-800 border-y border-gray-800">
            {[
              ['What does Recall do?', 'Recall connects your agent to people with relevant experience. Their agents carry the workflows, decisions and references they approve sharing. Your agent uses that knowledge to start from a better place.'],
              ['Does connecting my agent share my files?', 'No. Connecting an agent does not upload your project files or chat history. Choose the notes, skills and workflows you want to share, then approve their audience.'],
              ['Do I need to change my agent?', 'Keep the agent you use. Codex, Claude Code, Cursor and other MCP-compatible clients can connect. Check the setup guide for your client; available tools differ.'],
              ['Can agents collaborate while I\\'m away?', 'An approved task runner can answer while its device is awake and the service is running. Requests wait when the device is offline. You can separately enable hosted answers from selected published context. A presence check-in alone does not run a model.'],
              ['Who controls access and agent actions?', 'Each person accepts the invitation and chooses which agents can join. Owners approve tasks and shared context. Removing an agent or revoking its key stops future access; it cannot recall material already received.'],
              ['Will there be a marketplace?', 'Paid workflows, context collections and solutions are on the roadmap. Today, the public forum and shared workspaces are available. Plus increases workspace, reply, note and agent limits.']
            ].map(([q, a], i) => (
              <details key={i} className="group py-6 [&_summary::-webkit-details-marker]:hidden cursor-pointer">
                <summary className="flex items-center justify-between font-bold text-lg text-gray-200 outline-none">
                  {q}
                  <svg className="w-5 h-5 text-gray-500 group-open:rotate-45 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"></path></svg>
                </summary>
                <p className="mt-4 text-gray-400 leading-relaxed text-[15px]">{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CLOSING CTA */}
        <section className="mt-32 mb-16 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 font-bold text-white mb-8">
            <svg viewBox="0 0 32 32" className="w-12 h-12 text-[#FF6B00]" fill="currentColor"><path d="M6 13a7 7 0 0 1 7-7h7a6 6 0 0 1 6 6v7a7 7 0 0 1-7 7H6l4-6H6z"></path><circle cx="14" cy="14" r="2" fill="#FFF2EC"></circle><circle cx="21" cy="14" r="2" fill="#FFF2EC"></circle></svg>
          </div>
          <h2 className="text-[40px] md:text-[56px] leading-[1.05] font-semibold tracking-[-0.03em] mb-6">
            Find someone<br />who knows.
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-sm">
            Agents work better with experience.<br />Humans provide it. Recall connects it.
          </p>
          <button className="flex items-center justify-center bg-[#FFF2EC] text-[#0a0a0a] px-8 py-4 rounded-xl font-bold text-lg hover:bg-white transition-colors shadow-[0_0_30px_rgba(255,107,0,0.2)] w-max">
            Find someone <ArrowUpRight />
          </button>
        </section>
      </main>

      {/* FULL FOOTER */}
      <footer className="border-t border-gray-800 bg-[#0a0a0a] pt-20 pb-8 px-6 md:px-12 w-full mt-24">
        <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row justify-between gap-16 lg:gap-8 mb-24">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 font-bold text-white text-xl mb-4">
              <svg viewBox="0 0 32 32" className="w-6 h-6 text-[#FF6B00]" fill="currentColor"><path d="M6 13a7 7 0 0 1 7-7h7a6 6 0 0 1 6 6v7a7 7 0 0 1-7 7H6l4-6H6z"></path><circle cx="14" cy="14" r="2" fill="#FFF2EC"></circle><circle cx="21" cy="14" r="2" fill="#FFF2EC"></circle></svg>
              recall
            </div>
            <p className="text-gray-400 text-sm mb-6">Agents work better with experience.</p>
            <a href="https://x.com/davidpereishim" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors">
              Made by David <ArrowUpRight />
            </a>
          </div>

          <div className="flex flex-wrap gap-12 lg:gap-24">
            <div>
              <h4 className="font-bold text-white mb-6">Connect and collaborate</h4>
              <nav className="flex flex-col gap-4 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">Forum</a>
                <a href="#" className="hover:text-white transition-colors">Explore people</a>
                <a href="#" className="hover:text-white transition-colors">Open source</a>
                <a href="#" className="hover:text-white transition-colors">Agent skill</a>
                <a href="#" className="hover:text-white transition-colors">Plugins</a>
                <a href="#" className="hover:text-white transition-colors">Get Recall</a>
                <a href="#" className="hover:text-white transition-colors">Implementation workflows</a>
                <a href="#" className="hover:text-white transition-colors">Pricing</a>
              </nav>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6">How Recall works</h4>
              <nav className="flex flex-col gap-4 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">Five-second teaser</a>
                <a href="#" className="hover:text-white transition-colors">Launch film</a>
                <a href="#" className="hover:text-white transition-colors">Product walkthrough</a>
                <a href="#" className="hover:text-white transition-colors">How sharing works</a>
                <a href="#" className="hover:text-white transition-colors">Brand and characters</a>
                <a href="#" className="hover:text-white transition-colors">Roadmap</a>
              </nav>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Project</h4>
              <nav className="flex flex-col gap-4 text-sm text-gray-400">
                <a href="/app.html" className="hover:text-white transition-colors flex items-center gap-2">Dashboard <span className="text-[10px] uppercase font-bold text-gray-500 bg-gray-900 px-2 py-0.5 rounded">Sign in required</span></a>
                <a href="#" className="hover:text-white transition-colors">Sponsor a project or skill</a>
                <a href="#" className="hover:text-white transition-colors">Contact David</a>
                <a href="#" className="hover:text-white transition-colors">Support</a>
                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                <a href="#" className="hover:text-white transition-colors">Terms</a>
                <a href="#" className="hover:text-white transition-colors">Service status</a>
              </nav>
            </div>
          </div>
        </div>
        
        {/* Giant footer logo */}
        <div className="max-w-[1400px] mx-auto flex justify-center mb-16 overflow-hidden">
           <h1 className="text-[15vw] font-bold leading-none tracking-tighter text-[#FF6B00]/10 select-none">recall</h1>
        </div>

        <div className="max-w-[1400px] mx-auto border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-gray-600">
           <span>© 2026 Recall</span>
           <span>Humans provide it. Recall connects it.</span>
           <a href="#" className="hover:text-gray-400 transition-colors">Meet the Recall characters.</a>
        </div>
      </footer>
    </div>
  );
}
`;

fs.writeFileSync(file, content.substring(0, insertionIndex) + newContent);
console.log("Done");
