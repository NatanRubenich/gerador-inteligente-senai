import { Linkedin, Github, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-400 py-8 mt-12 no-print">
      <div className="max-w-6xl mx-auto px-4">
        {/* Informações do Sistema */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-300">
            Gerador Inteligente SENAI - Sistema de Educação Profissional
          </p>
          <p className="text-xs mt-1">
            RAG Especialista + Metodologia SENAI de Educação Profissional (MSEP)
          </p>
        </div>

        {/* Divisor */}
        <div className="border-t border-gray-700 my-4"></div>

        {/* Créditos do Desenvolvedor */}
        <div className="text-center">
          <p className="text-sm text-gray-300 mb-3">
            Desenvolvido por <span className="text-white font-medium">Prof. Natan Evangelista Rübenich</span>
          </p>
          
          {/* Redes Sociais */}
          <div className="flex items-center justify-center gap-4">
            <a
              href="https://www.linkedin.com/in/natan-rubenich/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-[#0077b5] transition-colors"
              title="LinkedIn"
            >
              <Linkedin size={18} />
              <span className="text-xs">LinkedIn</span>
            </a>
            
            <a
              href="https://github.com/NatanRubenich"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              title="GitHub"
            >
              <Github size={18} />
              <span className="text-xs">GitHub</span>
            </a>
            
            <a
              href="mailto:natan_rubenich@icloud.com"
              className="flex items-center gap-2 text-gray-400 hover:text-[#00b4d8] transition-colors"
              title="Email"
            >
              <Mail size={18} />
              <span className="text-xs">Email</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
