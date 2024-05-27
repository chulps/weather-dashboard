import React, { useEffect, useState } from 'react';
import { translateText } from '../utils/translate';

const TranslationWrapper = ({ children, targetLanguage }) => {
  const [translatedContent, setTranslatedContent] = useState(children);

  useEffect(() => {
    const translateContent = async () => {
      if (typeof children === 'string') {
        const translation = await translateText(children, targetLanguage);
        setTranslatedContent(translation);
      } else if (React.isValidElement(children)) {
        const translation = await translateText(children.props.children, targetLanguage);
        setTranslatedContent(React.cloneElement(children, { children: translation }));
      }
    };

    translateContent();
  }, [children, targetLanguage]);

  return <>{translatedContent}</>;
};

export default TranslationWrapper;
