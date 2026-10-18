import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ButtonLink } from '@/components/ui/Button';
import { Img } from '@/components/ui/Img';
import { Modal } from '@/components/ui/Modal';
import { categoryLabel, menuById } from '@/data/menu';
import { kyat } from '@/lib/utils';
import { useWishlist } from '@/store/wishlistStore';

/** "My Evening" — saved dishes and wines, stored in this browser and attachable to a reservation. */
export function WishlistDrawer() {
  const { ids, open, setOpen, remove, clear } = useWishlist();
  const items = ids.map((id) => menuById.get(id)).filter((x) => x !== undefined);
  const close = () => setOpen(false);

  return (
    <Modal open={open} onClose={close} labelledBy="wishlist-title" variant="drawer">
      <div className="border-b border-line/15 px-6 pb-6 pt-8">
        <p className="eyebrow mb-3">Saved in this browser</p>
        <h2 id="wishlist-title" className="display-md">
          My Evening
        </h2>
        <p className="mt-3 text-sm text-muted">
          Dishes and wines you would like to remember. They can be attached to your reservation as a note for the kitchen.
        </p>
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {items.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted">
            Nothing saved yet. Tap the heart on any dish in the{' '}
            <Link to="/menu" onClick={close} className="link-underline text-accent">
              menu
            </Link>
            .
          </p>
        ) : (
          <ul className="divide-y divide-line/10">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 py-4">
                <Img k={item.image} alt="" sizes="64px" className="h-16 w-16 shrink-0 object-cover" />
                <div className="min-w-0 flex-1">
                  <Link to={`/menu/${item.slug}`} onClick={close} className="link-underline block truncate font-display text-xl">
                    {item.name}
                  </Link>
                  <p className="text-xs text-muted">
                    {categoryLabel(item.category)} · <span className="tabular">{kyat(item.price)}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  className="grid h-11 w-11 place-items-center text-muted transition-colors hover:text-status-full"
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line/15 px-6 py-5">
          <button type="button" onClick={clear} className="link-underline text-xs uppercase tracking-[0.18em] text-muted hover:text-fg">
            Clear all
          </button>
          <ButtonLink to="/reservations" onClick={close} icon>
            Reserve with these
          </ButtonLink>
        </div>
      )}
    </Modal>
  );
}
