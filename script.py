import re

# Update contact-section.tsx
contact_path = r'c:\Users\VINI DEV\Desktop\Banda\web\components\band\contact-section.tsx'
with open(contact_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("import { Mail, Phone, MapPin, Send, Instagram, Youtube, Facebook, Music } from 'lucide-react'", "import { Mail, Phone, MapPin, Send, Instagram, Youtube, Facebook, Music, Loader2 } from 'lucide-react'")
content = content.replace("import { Input } from '@/components/ui/input'", "import { Input } from '@/components/ui/input'\nimport { apiSettings, Settings } from '@/lib/api'")
content = content.replace("export function ContactSection() {\n  const [formData, setFormData] = useState({\n", "export function ContactSection() {\n  const [settings, setSettings] = useState<Settings | null>(null)\n  const [formData, setFormData] = useState({\n")

effect = '''
  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await apiSettings.get()
        setSettings(data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchSettings()
  }, [])
'''
content = content.replace("  const handleSubmit =", effect + "\n  const handleSubmit =")

loading = '''
  if (!settings) {
    return (
      <section id="contato" className="py-24 bg-secondary/30 flex justify-center items-center min-h-[500px]">
         <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </section>
    )
  }

  return (
'''
content = content.replace("  return (\n", loading)

# Replacements for contact fields
content = content.replace(">contato@marianamaciel.com.br</a>", ">{settings.email}</a>")
content = content.replace('href="mailto:contato@marianamaciel.com.br"', 'href={mailto:}')

content = content.replace(">+55 (11) 99999-9999</a>", ">{settings.phone}</a>")
content = content.replace('href="tel:+5511999999999"', 'href={	el:}')

content = content.replace("São Paulo, Brasil</p>", "{settings.location}</p>")

content = content.replace('href="#" \n                  className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all"\n                  aria-label="Instagram"', 'href={settings.instagram} target="_blank" rel="noreferrer"\n                  className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all"\n                  aria-label="Instagram"')

content = content.replace('href="#" \n                  className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all"\n                  aria-label="YouTube"', 'href={settings.youtube} target="_blank" rel="noreferrer"\n                  className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all"\n                  aria-label="YouTube"')

content = content.replace('href="#" \n                  className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all"\n                  aria-label="Facebook"', 'href={settings.facebook} target="_blank" rel="noreferrer"\n                  className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all"\n                  aria-label="Facebook"')

content = content.replace('href="#" \n                  className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all"\n                  aria-label="Spotify"', 'href={settings.tiktok} target="_blank" rel="noreferrer"\n                  className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all"\n                  aria-label="TikTok"')

content = content.replace(">assessoria@marianamaciel.com.br</a>", ">{settings.managementEmail}</a>")
content = content.replace('href="mailto:assessoria@marianamaciel.com.br"', 'href={mailto:}')

with open(contact_path, 'w', encoding='utf-8') as f:
    f.write(content)

# Update admin/page.tsx
admin_path = r'c:\Users\VINI DEV\Desktop\Banda\web\app\admin\page.tsx'
with open(admin_path, 'r', encoding='utf-8') as f:
    acontent = f.read()

# Add Settings import and icon
acontent = acontent.replace("import { apiShows, apiMedia, Show, Media } from '@/lib/api'", "import { apiShows, apiMedia, apiSettings, Show, Media, Settings } from '@/lib/api'")
acontent = acontent.replace("MapPin, Clock, Ticket, Loader2, ArrowLeft, Image as ImageIcon, Video, Link as LinkIcon", "MapPin, Clock, Ticket, Loader2, ArrowLeft, Image as ImageIcon, Video, Link as LinkIcon, Settings as SettingsIcon")

# Update activeTab state definition
acontent = acontent.replace("const [activeTab, setActiveTab] = useState<'shows' | 'media'>('shows')", "const [activeTab, setActiveTab] = useState<'shows' | 'media' | 'settings'>('shows')")

# Add settings state
settings_state = '''
  const [loadingSettings, setLoadingSettings] = useState(false)
  const [settings, setSettings] = useState<Settings>({
    email: '', phone: '', location: '', instagram: '', youtube: '', facebook: '', tiktok: '', managementEmail: ''
  })
'''
acontent = acontent.replace("const [shows, setShows] = useState<Show[]>([])", settings_state + "\n  const [shows, setShows] = useState<Show[]>([])")

# Add fetchSettings function
fetch_settings = '''
  const fetchSettings = async () => {
    try {
      setLoadingSettings(true)
      const data = await apiSettings.get()
      setSettings(data)
    } catch (err: any) {
      toast.error('Erro ao buscar configurações.')
    } finally {
      setLoadingSettings(false)
    }
  }
'''
acontent = acontent.replace("const fetchShows = async () => {", fetch_settings + "\n  const fetchShows = async () => {")

acontent = acontent.replace("fetchShows()\n      fetchMedia()", "fetchShows()\n      fetchMedia()\n      fetchSettings()")

# Add tab button
settings_btn = '''
            <button
              onClick={() => setActiveTab('settings')}
              className={lex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer }
            >
              <SettingsIcon className="w-4 h-4" />
              Configurações
            </button>
'''
acontent = acontent.replace(">Galeria de Mídias\n            </button>\n          </div>", ">Galeria de Mídias\n            </button>\n" + settings_btn + "          </div>")

# Add save settings handler
save_settings_handler = '''
  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSubmitLoading(true)
      await apiSettings.update(settings)
      toast.success('Configurações atualizadas!')
    } catch (err: any) {
      toast.error(err.message || 'Erro ao atualizar.')
    } finally {
      setSubmitLoading(false)
    }
  }
'''
acontent = acontent.replace("const handleLogout = () => {", save_settings_handler + "\n  const handleLogout = () => {")


# Add settings tab content
settings_tab = '''
        {/* Tab Contents: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-card/20 border border-border/80 rounded-3xl overflow-hidden shadow-xl backdrop-blur-md p-8">
            <h3 className="font-serif text-2xl font-bold mb-6">Informações de Contato e Redes Sociais</h3>
            {loadingSettings ? (
              <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : (
              <form onSubmit={handleSettingsSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">E-mail Principal</label>
                    <input type="email" value={settings.email} onChange={(e) => setSettings({...settings, email: e.target.value})} className="w-full bg-secondary/55 border border-border/55 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">E-mail de Assessoria</label>
                    <input type="email" value={settings.managementEmail} onChange={(e) => setSettings({...settings, managementEmail: e.target.value})} className="w-full bg-secondary/55 border border-border/55 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">Telefone / WhatsApp</label>
                    <input type="text" value={settings.phone} onChange={(e) => setSettings({...settings, phone: e.target.value})} className="w-full bg-secondary/55 border border-border/55 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">Localização</label>
                    <input type="text" value={settings.location} onChange={(e) => setSettings({...settings, location: e.target.value})} className="w-full bg-secondary/55 border border-border/55 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50" />
                  </div>
                </div>
                
                <h4 className="font-semibold text-lg mt-8 mb-4 border-b border-border/40 pb-2">Links de Redes Sociais</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">Instagram</label>
                    <input type="url" value={settings.instagram} onChange={(e) => setSettings({...settings, instagram: e.target.value})} className="w-full bg-secondary/55 border border-border/55 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">YouTube</label>
                    <input type="url" value={settings.youtube} onChange={(e) => setSettings({...settings, youtube: e.target.value})} className="w-full bg-secondary/55 border border-border/55 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">Facebook</label>
                    <input type="url" value={settings.facebook} onChange={(e) => setSettings({...settings, facebook: e.target.value})} className="w-full bg-secondary/55 border border-border/55 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-muted-foreground">TikTok / Spotify</label>
                    <input type="url" value={settings.tiktok} onChange={(e) => setSettings({...settings, tiktok: e.target.value})} className="w-full bg-secondary/55 border border-border/55 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50" />
                  </div>
                </div>

                <div className="pt-6 text-right">
                  <Button type="submit" disabled={submitLoading} className="bg-primary hover:bg-primary/90 px-8">
                    {submitLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Salvar Configurações
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}
'''
acontent = acontent.replace("        {/* --- FORM DIALOG MODAL --- */}", settings_tab + "\n        {/* --- FORM DIALOG MODAL --- */}")

with open(admin_path, 'w', encoding='utf-8') as f:
    f.write(acontent)

print("SUCESSO")
