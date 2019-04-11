import skmeans from 'skmeans';

export const K_CLUSTERS = 12;

/* Expects:
  1. an array of arbitrary data, each elementrepresenting a point in the space of your choice
  2. a mapper function defining the domain in which to cluster
*/
const cluster = (data, mapper) => {
  const clusters = skmeans(data.map(mapper), Math.min(K_CLUSTERS, data.length / 2), 'kmpp');
  console.log(`Clustered in ${clusters.it} iterations`);

  /** Drop one of each group of centroids that are very close to each other **/
  // const SIMILARITY_THRESHOLD = 1.25;
  // const parsedCentroids = clusters.centroids.map(c => Color.rgb(hsl.rgb(c)))
  //
  // let deleteIndices = [];
  // parsedCentroids.forEach((color, index) => {
  //   if (deleteIndices.includes(index)) { return; }
  //   let others = parsedCentroids.slice();
  //   others.splice(index, 1);
  //   const closest = others.filter((other) => color.contrast(other) <= SIMILARITY_THRESHOLD);
  //   if (closest.length >= 3 && parsedCentroids.length > 3) {
  //     const deleteIndex = _.minBy(_.range(parsedCentroids.length), i => groupedColors[i].length);
  //     console.log(`Dropping centroid ${parsedCentroids[deleteIndex].string()} (${deleteIndex}): ${closest.length} others within ${SIMILARITY_THRESHOLD}`)
  //     deleteIndices.push(deleteIndex);
  //   }
  // });
  //
  // _.uniq(deleteIndices).forEach(i => {
  //   clusters.centroids.splice(i, 1);
  //   parsedCentroids.splice(i, 1);
  //   groupedColors.splice(i, 1);
  // })

  /** Map original data points to their corresponding centroids **/
  /* Skmeans retains point => centroid mappings in an array of indices, where the position in
   * the array is the same as the position in the original (data) array, and the index
   * points to the position of the centroid. So clusters.idxs[index_of_color_in_data_array]
   * gives the index of a centroid in clusters */
  /* groupedChildren will contain an array the length of `clusters`, each element an array of
   * points corresponding to the centroid at that index in `clusters` */
  const groupedChildren = data.reduce((memo, point, idx) => {
    const centroidIndex = clusters.idxs[idx];
    const nextMemo = memo.slice();
    nextMemo.splice(centroidIndex, 1, memo[centroidIndex].concat([point]));
    return nextMemo;
  }, _.range(clusters.centroids.length).map(() => []));

  return clusters.centroids.map((centroid, idx) => ({
    point: centroid,
    children: groupedChildren[idx],
  }))
}

export default cluster;
