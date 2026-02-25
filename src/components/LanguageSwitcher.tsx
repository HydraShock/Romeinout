import LangPill from './LangPill';
import { useLanguage } from './LanguageProvider';

type LanguageSwitcherProps = {
  isScrolled?: boolean;
  inDrawer?: boolean;
  className?: string;
};

export default function LanguageSwitcher({
  isScrolled = false,
  inDrawer = false,
  className = '',
}: LanguageSwitcherProps) {
  const { lang, setLang } = useLanguage();

  const rootClasses = [
    'language-switcher relative',
    isScrolled ? 'is-scrolled' : '',
    inDrawer ? 'is-drawer' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={rootClasses}>
      <LangPill
        value={lang.toUpperCase()}
        active
        aria-label={lang === 'it' ? 'Passa a Inglese' : 'Switch to Italian'}
        onClick={() => setLang(lang === 'en' ? 'it' : 'en')}
      />
    </div>
  );
}
