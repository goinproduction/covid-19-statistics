// Sắp xếp các quốc gia có số ca nhiễm lớn nhất, sorted by cases
export const sortData = data => {
    const sortedData = [...data];
    sortedData.sort((a, b) => {
        if(a.cases > b.cases){
            return -1;
        }else{
            return 1;
        }
    });
    return sortedData;
}