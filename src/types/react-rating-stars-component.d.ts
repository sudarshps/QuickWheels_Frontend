declare module 'react-rating-stars-component' {
    import { FC } from 'react';
  
    interface ReactStarsProps {
      count: number;
      onChange: (newRating: number) => void;
      size: number;
      isHalf: boolean;
      emptyIcon: JSX.Element;
      halfIcon: JSX.Element;
      fullIcon: JSX.Element;
      activeColor: string;
    }
  
    const ReactStars: FC<ReactStarsProps>;
  
    export default ReactStars;
  }
  