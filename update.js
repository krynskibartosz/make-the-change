const fs = require('fs');
const file = 'apps/web-client/src/app/[locale]/(marketing)/products/[id]/product-quick-view.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /const \[isNutritionModalOpen, setIsNutritionModalOpen\] = useState\(false\);/,
  "const [isNutritionModalOpen, setIsNutritionModalOpen] = useState(false);\n  const [hasAddress, setHasAddress] = useState(false);\n  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);"
);

const searchStr = `            {/* Bouton Primaire : Échange en Points */}`;
const endStr = `            )}`;

const startIndex = content.indexOf(searchStr);
if (startIndex !== -1) {
  const endIndex = content.indexOf(endStr, startIndex) + endStr.length;
  
  const replacement = `            {/* Boutons d'Achat Dynamiques */}
            {!hasAddress ? (
              <button 
                onClick={() => setIsAddressModalOpen(true)}
                className="flex w-full h-14 items-center justify-center gap-2 rounded-2xl bg-blue-500 text-[17px] font-black text-white shadow-[0_0_30px_rgba(59,130,246,0.2)] active:scale-[0.98] transition-all animate-in fade-in zoom-in duration-300"
              >
                <Truck className="w-5 h-5" /> Ajouter une adresse de livraison
              </button>
            ) : userBalance >= displayPoints ? (
              <>
                <button 
                  key={\`exchange-\${selectedFormat.points}\`}
                  onClick={() => setIsCheckoutOpen(true)}
                  className="flex w-full h-14 items-center justify-center gap-2 rounded-2xl bg-lime-400 text-[17px] font-black text-[#0B0F15] shadow-[0_0_30px_rgba(132,204,22,0.2)] active:scale-[0.98] transition-all animate-in fade-in zoom-in duration-300"
                >
                  Échanger <span className="tabular-nums">{displayPoints.toLocaleString('fr-FR')}</span> <Sparkles className="w-4 h-4" />
                </button>
                
                {displayPrice > 0 && (
                  <button 
                    onClick={() => setIsFiatCheckoutOpen(true)}
                    className="flex w-full mt-2 items-center justify-center rounded-2xl px-4 py-1.5 text-xs font-medium text-white/40 hover:text-white transition-colors active:scale-[0.98] active:opacity-50"
                  >
                    Ou acheter pour {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                      maximumFractionDigits: 2,
                    }).format(displayPrice)}
                  </button>
                )}
              </>
            ) : (
              <>
                <button 
                  key={\`buy-\${selectedFormat.euros}\`}
                  onClick={() => setIsFiatCheckoutOpen(true)}
                  className="flex w-full h-14 items-center justify-center gap-2 rounded-2xl bg-lime-400 text-[17px] font-black text-[#0B0F15] shadow-[0_0_30px_rgba(132,204,22,0.2)] active:scale-[0.98] transition-all animate-in fade-in zoom-in duration-300"
                >
                  Acheter pour {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                    maximumFractionDigits: 2,
                  }).format(displayPrice)}
                </button>
                <div className="mt-2 text-center text-xs text-white/60">
                  Il vous manque <span className="font-bold text-lime-400">{displayPoints - userBalance} ✨</span> pour l'obtenir gratuitement.{' '}
                  <a href={\`/\${locale}/projects\`} className="text-white underline decoration-white/30 hover:decoration-white transition-all">Soutenir un projet</a>
                </div>
              </>
            )}`;
  
  content = content.substring(0, startIndex) + replacement + content.substring(endIndex);
  console.log('Replaced button block successfully.');
} else {
  console.log('Could not find button block.');
}

const modalSearch = `      {/* ── Checkout Fiat Interceptée ── */}`;
const modalIndex = content.indexOf(modalSearch);

if (modalIndex !== -1 && !content.includes('isAddressModalOpen &&')) {
  const modalReplacement = `      {/* ── MODALE BOTTOM SHEET (ADRESSE MOCK) ── */}
      <AnimatePresence>
      {isAddressModalOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] overflow-y-auto bg-[#0B0F15]"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="sticky top-0 z-20 bg-[#0B0F15]/90 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-white/5 pt-[max(1.5rem,env(safe-area-inset-top))]">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Adresse de livraison</h3>
              <p className="text-sm text-white/50">Où devons-nous l'envoyer ?</p>
            </div>
            <button 
              onClick={(event) => {
                event.stopPropagation()
                setIsAddressModalOpen(false)
              }}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center active:scale-95 transition-transform"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="px-6 pb-[max(2rem,env(safe-area-inset-bottom))] mt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Adresse</label>
              <input type="text" placeholder="123 rue de la Paix" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Code Postal</label>
                <input type="text" placeholder="75000" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/50 uppercase tracking-wider">Ville</label>
                <input type="text" placeholder="Paris" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30" />
              </div>
            </div>
            
            <button 
              onClick={() => {
                setHasAddress(true)
                setIsAddressModalOpen(false)
              }}
              className="w-full h-14 mt-6 flex items-center justify-center rounded-2xl bg-blue-500 text-white font-bold text-[17px] active:scale-[0.98] transition-transform"
            >
              Enregistrer l'adresse
            </button>
          </div>
        </motion.div>
      )}
      </AnimatePresence>

` + modalSearch;

  content = content.replace(modalSearch, modalReplacement);
  console.log('Replaced modal block successfully.');
}

fs.writeFileSync(file, content, 'utf8');
