import { useState } from "react";

type AvatarProps = {
  src?: string | null;
  name?: string;
  size?: number;
  ring?: boolean;
  className?: string;
};

export default function Avatar({ src, name = "", size = 40, ring = false, className = "" }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const initials = name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";
  const style = { width: size, height: size };

  const inner =
    src && !failed ? (
      <img
        src={src}
        alt={name}
        style={style}
        className={`avatar ${className}`}
        onError={() => setFailed(true)}
        loading="lazy"
      />
    ) : (
      <span
        style={{ ...style, fontSize: size * 0.38 }}
        className={`avatar grid place-items-center font-semibold text-brand ${className}`}
        aria-label={name}
      >
        {initials}
      </span>
    );

  return ring ? <span className="avatar-ring">{inner}</span> : inner;
}
