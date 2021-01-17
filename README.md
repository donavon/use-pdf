# use-pdf

This is a simple React Hook around [@react-pdf/renderer](https://react-pdf.org/).

[![npm version](https://badge.fury.io/js/use-pdf.svg)](https://badge.fury.io/js/use-pdf)

## Installation

```bash
$ npm i use-pdf
```

or

```bash
$ yarn add use-pdf
```

## Usage

`@react-pdf/renderer` is great, but using it to render a PDF blob url requires that you use a render prob like some sort of barbarian.

```js
import { BlobProvider, Document, Page, Text } from '@react-pdf/renderer';

export const MyPDF = ({ name }) => {
  const document = useMemo(
    () => (
      <Document>
        <Page>
          <Text>Hello {name} from a PDF</Text>
        </Page>
      </Document>
    ),
    [name]
  );

  return (
    <BlobProvider document={document}>
      {({ loading, url, error }) => {
        if (loading) {
          return <div>Rendering PDF...</div>;
        }

        if (error) {
          return <div>Error rendering PDF</div>;
        }

        return <iframe title="PDF" src={url} />;
      }}
    </BlobProvider>
  );
};
```

But with `use-pdf`, you can use a React Hook like a civilized human being.

```js
import { Document, Page, Text } from '@react-pdf/renderer';
import { usePDF } from 'use-pdf';

export const MyPDF = ({ name }) => {
  const document = useMemo(
    () => (
      <Document>
        <Page>
          <Text>Hello {name} from a PDF</Text>
        </Page>
      </Document>
    ),
    [name]
  );

  const { loading, error, url } = usePDF(document);

  if (loading) {
    return <div>Rendering PDF...</div>;
  }

  if (error) {
    return <div>Error rendering PDF</div>;
  }

  return <iframe title="PDF" src={url} />;
};
```

### Parameters <a name="parameters"></a>

Here are the parameters that you can use..

| Parameter  | Description                                                                                  |
| :--------- | :------------------------------------------------------------------------------------------- |
| `document` | A `PDFDocument`. See [react-pdf documentation](https://react-pdf.org/) for more information. |

> Note: Be sure to memoize the `document` sent to `usePDF` or it will endlessly rerender.

### Return

This hook returns:

| Parameter | Description                                                                                                                                                                                             |
| :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `loading` | A boolean that is set to `true` is the PDF is busy rendering.                                                                                                                                           |
| `error`   | An `Error` object if the PDF rendering failed.                                                                                                                                                          |
| `url`     | A string that represents a `url` suitable to pass to an `iframe`, a new browser tab, or whatever. This is a blob url that will be revoked when the component containing the `usePDF` hook is unmounted. |

## Example

See a working example in the `/example` folder. To run the example execute the following:

```bash
cd example
npm i
npm start
```

## License

**[MIT](LICENSE)** Licensed
