import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";

interface ImageLightboxProps {
  open: boolean;
  index: number;
  images: Array<{ src: string }>;
  onClose: () => void;
}

export default function ImageLightbox({ open, index, images, onClose }: ImageLightboxProps) {
  return (
    <Lightbox
      open={open}
      index={index}
      close={onClose}
      slides={images}
      plugins={[Thumbnails, Zoom]}
      thumbnails={{
        position: "bottom",
        width: 120,
        height: 80,
        border: 2,
        borderRadius: 8,
        padding: 0,
        gap: 16,
      }}
      zoom={{
        maxZoomPixelRatio: 3,
        scrollToZoom: true,
      }}
      styles={{
        container: {
          backgroundColor: "rgba(0, 0, 0, 0.95)",
        },
        thumbnailsContainer: {
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        },
      }}
      carousel={{
        finite: false,
        preload: 2,
      }}
      controller={{
        closeOnBackdropClick: true,
      }}
    />
  );
}
