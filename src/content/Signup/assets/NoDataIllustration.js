import NoDataIllustrationEnt from "./NoDataIllustrationEnt";
import NoDataIllustrationPro from "./NoDataIllustrationPro";
import NoDataIllustrationFre from "./NoDataIllustrationFre";
import NoDataIllustrationExp from "./NoDataIllustrationExp";

const NoDataIllustration = ({ variant, ...props }) => {
  switch (variant) {
    case "ent":
      return <NoDataIllustrationEnt {...props} />;
    case "pro":
      return <NoDataIllustrationPro {...props} />;
    case "fre":
      return <NoDataIllustrationFre {...props} />;
    case "exp":
      return <NoDataIllustrationExp {...props} />;
    default:
      return <NoDataIllustrationEnt {...props} />;
  }
};

export default NoDataIllustration;