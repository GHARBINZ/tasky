from pathlib import Path
svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect x="6" y="6" width="52" height="52" rx="14" fill="#EAE2D6" stroke="#A38666" stroke-width="4" />
  <path d="M22 32l8 8 14-16" stroke="#A38666" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none" />
</svg>
'''
Path('public/favicon.svg').write_text(svg, encoding='utf-8')
