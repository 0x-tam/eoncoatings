import type {ComponentPropsWithRef} from 'react';

type PageLinkProps = ComponentPropsWithRef<'a'> & {prefetch?: boolean | null};

// Native document navigation avoids the preview runtime's failing RSC router.
// Anchor hashes, history, modifier keys and the finder click handler stay native.
export default function PageLink({prefetch: _prefetch, ...props}: PageLinkProps) {
  return <a {...props}/>;
}
