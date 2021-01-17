import { pdf } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';

type PDFDocument = React.ReactElement<any>;
type State = 'loading' | 'error' | 'complete';

type UsePDFResults =
  | {
      loading: true;
      error: null;
      url: null;
    }
  | {
      loading: false;
      error: Error;
      url: null;
    }
  | {
      loading: false;
      error: null;
      url: string;
    };

export const usePDF = (document: PDFDocument) => {
  const [state, setState] = useState<State>('loading');
  const [error, setError] = useState<Error | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let newUrl: string;

    const generateUrl = async () => {
      try {
        setState('loading');
        const blob = await pdf(document).toBlob();
        newUrl = URL.createObjectURL(blob);
        setUrl(newUrl);
        setState('complete');
      } catch (err) {
        setError(err);
        setState('error');
      }
    };

    generateUrl();

    return () => {
      if (newUrl) {
        URL.revokeObjectURL(newUrl);
      }
    };
  }, [document]);

  return {
    loading: state === 'loading',
    error: state === 'error' ? error! : null,
    url: state === 'complete' ? url! : null,
  } as UsePDFResults;
};
