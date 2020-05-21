import PostImagePlaceholderLightMode from '../assets/images/LazyLoadPlaceholderLightMode.png';
import PostImagePlaceholderDarkMode from '../assets/images/LazyLoadPlaceholderDarkMode.png';

export const useTheme = () => {

  const PostImagePlaceholderFunction = () => {
    const theme = localStorage.getItem('theme');
    switch (theme) {
      case 'dark-mode':
        return PostImagePlaceholderDarkMode;
      case 'light-mode':
        return PostImagePlaceholderLightMode;
      default:
        return PostImagePlaceholderLightMode;
    }
  };

  const PostImagePlaceholder = PostImagePlaceholderFunction();

  return {
    PostImagePlaceholder,
  };
};
