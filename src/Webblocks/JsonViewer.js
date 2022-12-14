import JSONPretty from 'react-json-pretty';

function JsonViewer(props) {

    return(
        <div class="accordion accordion-flush" id="accordionFlushExample">
  <div class="accordion-item">
    <h2 class="accordion-header" id="flush-headingOne">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
       <a> Metadata</a>
      </button>
    </h2>
    <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
      <div class="accordion-body"><JSONPretty id="json-pretty" data={props.request}></JSONPretty></div>
    </div>
  </div>
  </div>
    )
}

export default JsonViewer;