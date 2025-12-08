export function SocialIcon({ Icon, url }: any) {
  return (
    <a
      href={url}
      target="_blank"
      className="text-white/60 hover:text-white hover:scale-110 transition-all"
    >
      <Icon size={22} />
    </a>
  );
}
