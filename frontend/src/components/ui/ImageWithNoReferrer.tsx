import type React from "react"

interface ImageWithNoReferrerProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

const ImageWithNoReferrer: React.FC<ImageWithNoReferrerProps> = (props) => {
  return <img {...props} referrerPolicy="no-referrer" />
}

export default ImageWithNoReferrer

