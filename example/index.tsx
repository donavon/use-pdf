import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Document, Page, Text } from '@react-pdf/renderer';
import { usePDF } from '../.';

const HelloPDF = ({ name }) => {
  const document = React.useMemo(
    () => (
      <Document title="usePDF Example">
        <Page size="letter">
          <Text>Hello {name} from a PDF</Text>
        </Page>
      </Document>
    ),
    [name]
  );

  const results = usePDF(document);

  if (results.loading) {
    return <div>Rendering PDF...</div>;
  }

  if (results.error) {
    return <div>Error rendering PDF: {results.error.message}</div>;
  }

  return <iframe title="PDF" src={results.url} />;
};

const App = () => {
  return (
    <div>
      <HelloPDF name="World" />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
