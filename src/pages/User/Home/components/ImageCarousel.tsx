import * as React from "react";
import Autoplay from "embla-carousel-autoplay";

import { Card, CardContent } from "../../../../components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../../../components/ui/carousel";
import Img1 from "../../../../assets/carouselimg1.jpg"
import Img2 from "../../../../assets/carouselimg2.jpg"
import Img3 from "../../../../assets/carouselimg3.jpg"
import Img4 from "../../../../assets/carouselimg4.jpg"
import Img5 from "../../../../assets/carouselimg5.jpg"

const images = [
  Img1,
  Img2,
  Img3,
  Img4,
  Img5,
];

export default function CarouselPlugin() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {images.map((img, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="">
                  <img src={img} key={index} className="rounded-2xl" alt="img" />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* <CarouselPrevious />
      <CarouselNext /> */}
    </Carousel>
  );
}
