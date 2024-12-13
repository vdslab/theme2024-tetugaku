import * as d3 from 'd3';

function FetchData() {
    return d3.json("/data/miserables.json")
    .then(data => {
      return data;
    })
    .catch(error => {
      throw error;
    });

    
}

export default FetchData;