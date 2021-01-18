# use-pdf

This is a simple React Hook around the amazing [@react-pdf/renderer](https://react-pdf.org/).

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

`@react-pdf/renderer` is great, you can render a PDF into an iframe using `<PDFViewer/>`, but to have full control over loading and error states requires that you use the `BlobProvider` component and a render prop like some sort of barbarian.

```js
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
```

But with `use-pdf`, you can use a React Hook like a civilized human being.

```js
const { loading, error, url } = usePDF(document);

if (loading) {
  return <div>Rendering PDF...</div>;
}

if (error) {
  return <div>Error rendering PDF</div>;
}

return <iframe title="PDF" src={url} />;
```

### Parameters <a name="parameters"></a>

Here are the parameters that you can use.

| Parameter  | Description                                                                                  |
| :--------- | :------------------------------------------------------------------------------------------- |
| `document` | A `PDFDocument`. See [react-pdf documentation](https://react-pdf.org/) for more information. |

> Note: Be sure to memoize the `document` sent to `usePDF` or it will endlessly rerender.

### Return

This hook returns:

| Parameter | Description                                                                                                                                                                                                                                                     |
| :-------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `loading` | A boolean that is set to `true` is the PDF is busy rendering.                                                                                                                                                                                                   |
| `error`   | An `Error` object if the PDF rendering failed.                                                                                                                                                                                                                  |
| `url`     | A string that represents a `url` suitable to pass to an `iframe`, a new browser tab, or whatever. This is a blob url that will be revoked when the component containing the `usePDF` hook is unmounted. Will be `null` if `loading=true` or there was an error. |
| `blob`    | A `Blob` that represents the PDF or `null`. Will be set if `url` is set.                                                                                                                                                                                        |

## Example

See a working example in the `/example` folder. To run the example execute the following:

```bash
cd example
npm i
npm start
```

### PDFViewer

The example above shows a Hook alternative for `<PDFViewer/>` and supports loading and error fallbacks (which `PDFViewer` does not).

### PDFDownloadLink

If you're looking for a hooks replacement for `<PDFDownloadLink/>`, use the example code, but replace renderig the `iframe` with the following:

```js
return (
  <a download="somefilename.pdf" href={results.url}>
    Download PDF
  </a>
);
```

## License

**[MIT](LICENSE)** Licensed
