const resultByYear = function (post: any, year: string) {
    const selecteddate: any[] = []
    const postFinal: number[] = []

    //this will push the filtered year
    for (let i = 0; i < post.length; i++){
        if (year == post[i]?.createdAt.getFullYear().toString()) {
            selecteddate.push(post[i].createdAt)
        }
    }
    for (let i = 0; i < 12; i++){
        let mut: number = 0;
        for (let j = 0; j < selecteddate.length; j++){
            if (i == selecteddate[j].getMonth()) {
                mut++
            }
        }
        postFinal.push(mut)
    }
    return postFinal
}

const resultCurrentYear = function (post: any) {
    const postFinal: number[] = []
    for (let i = 0; i < 12; i++){
        let mut: number = 0;
        for (let j = 0; j < post.length; j++){
            if ((i == post[j]?.createdAt.getMonth()) && (new Date().getFullYear() == post[j].createdAt.getFullYear())) {
                mut++
            }
        }
        postFinal.push(mut)
    }
    return postFinal
}

export {
    resultByYear,
    resultCurrentYear
}