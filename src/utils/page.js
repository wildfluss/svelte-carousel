export function getNextPageIndexLimited({
  currentPageIndex,
  pagesCount,
  pagesToScroll,
  clonesCountTail,
}) {
  if (pagesCount < 1) throw new Error('pagesCount must be at least 1')
  return Math.min(Math.max(currentPageIndex + pagesToScroll, 0), pagesCount - 1)
}

export function getNextPageIndexInfinte({
  currentPageIndex,
  pagesCount,
  pagesToScroll,
  clonesCountTail,
}) {
  if (pagesCount < 1) throw new Error('pagesCount must be at least 1')
  const newCurrentPageIndex = Math.max(currentPageIndex, 0) + Math.min(pagesCount - clonesCountTail - currentPageIndex, pagesToScroll)
  return newCurrentPageIndex > pagesCount - 1 ? 0 : Math.max(newCurrentPageIndex, 0)
}

export function getNextPageIndexFn(infinite) {
  return infinite ? getNextPageIndexInfinte : getNextPageIndexLimited
}

export function getPrevPageIndexLimited({
  currentPageIndex,
  pagesCount,
  pagesToScroll,
}) {
  if (pagesCount < 1) throw new Error('pagesCount must be at least 1')
  return Math.max(Math.min(currentPageIndex - pagesToScroll, pagesCount - 1), 0)
}

export function getPrevPageIndexInfinte({
  currentPageIndex,
  pagesCount,
  pagesToScroll,
}) {
  if (pagesCount < 1) throw new Error('pagesCount must be at least 1')
  const newCurrentPageIndex = Math.min(currentPageIndex, pagesCount - 1) - Math.min(currentPageIndex, pagesToScroll)
  return newCurrentPageIndex >= 0 ? Math.min(newCurrentPageIndex, pagesCount - 1) : pagesCount - 1
}

export function getPrevPageIndexFn(infinite) {
  return infinite ? getPrevPageIndexInfinte : getPrevPageIndexLimited
}

export function getPageIndex({
  pageIndex,
  pagesCount,
}) {
  if (pagesCount < 1) throw new Error('pagesCount must be at least 1')
  return pageIndex < 0 ? 0 : Math.min(pageIndex, pagesCount - 1)
}

export function getAdjacentIndexes({
  pageIndex,
  pagesCount,
  infinite,
}) {
  if (pagesCount < 1) throw new Error('pagesCount must be at least 1')
  const _pageIndex = Math.max(0, Math.min(pageIndex, pagesCount - 1))
  let rangeStart = _pageIndex - 1;
  let rangeEnd = _pageIndex + 1;
  rangeStart = rangeStart < 0
    ? infinite
      ? pagesCount - 1
      : 0
    : rangeStart 
  rangeEnd = rangeEnd > pagesCount - 1
    ? infinite
        ? 0
        : pagesCount - 1
    : rangeEnd
  return [...new Set([rangeStart, rangeEnd, _pageIndex])].sort((a, b) => a - b)
}

export function getClones({
  headClonesCount,
  tailClonesCount,
  pagesContainerChildren,
}) {
  // TODO: add fns to remove clones if needed
  const clonesToAppend = []
  for (let i=0; i<tailClonesCount; i++) {
    clonesToAppend.push(pagesContainerChildren[i].cloneNode(true))
  }

  const clonesToPrepend = []
  const len = pagesContainerChildren.length
  for (let i=len-1; i>len-1-headClonesCount; i--) {
    clonesToPrepend.push(pagesContainerChildren[i].cloneNode(true))
  }

  return {
    clonesToAppend,
    clonesToPrepend,
  }
}

export function applyClones({
  pagesContainer,
  clonesToAppend,
  clonesToPrepend,
}) {
  console.log('clonesToPrepend', clonesToPrepend.length)
  console.log('clonesToAppend', clonesToAppend.length)
  for (let i=0; i<clonesToAppend.length; i++) {
    pagesContainer.append(clonesToAppend[i])
  }
  for (let i=0; i<clonesToPrepend.length; i++) {
    pagesContainer.prepend(clonesToPrepend[i])
  }
}

export function getPageSizes({
  pageWindowElement,
  pagesContainerChildren,
  pagesToShow,
}) {
  const pagesWindowWidth = pageWindowElement.clientWidth
  const pageWidth = pagesWindowWidth / pagesToShow
  const pagesCount = pagesContainerChildren.length

  return {
    pagesWindowWidth,
    pageWidth,
    pagesCount,
  }
}

export function applyPageSizes({
  pagesContainerChildren,
  pageWidth,
}) {
  for (let pageIndex=0; pageIndex<pagesContainerChildren.length; pageIndex++) {
    pagesContainerChildren[pageIndex].style.minWidth = `${pageWidth}px`
    pagesContainerChildren[pageIndex].style.maxWidth = `${pageWidth}px`
  }
}

export function getCurrentPageIndexWithoutClones({
  currentPageIndex,
  pagesCount,
  headClonesCount,
  infinite,
  pagesToScroll,
}) {
  if (infinite) {
    if (currentPageIndex === pagesCount - headClonesCount) return 0
    if (currentPageIndex === 0) return pagesCount - headClonesCount
    return Math.floor((currentPageIndex - headClonesCount) / pagesToScroll)
  }
  return currentPageIndex
}

export function getPagesCountWithoutClones({
  pagesCount,
  infinite,
  totalClonesCount,
  pagesToScroll,
}) {
  return Math.max(
    Math.ceil(
      (pagesCount - (infinite ? totalClonesCount : 0)) / pagesToScroll
    ),
  1)
}

export function getClonesCount({
  infinite,
  pagesToShow,
  partialPageSize,
}) {
  console.log('partialPageSize', partialPageSize)
  // Math.max(pagesToScroll, pagesToShow) // max - show 4, scroll 3, pages 7
  const clonesCount = infinite
    ? {
      head: partialPageSize || pagesToShow,
      tail: pagesToShow,
    } : {
      head: 0,
      tail: 0,
    }

  console.log('partialPageSize', partialPageSize)

  return {
    ...clonesCount,
    total: clonesCount.head + clonesCount.tail,
  }
}
