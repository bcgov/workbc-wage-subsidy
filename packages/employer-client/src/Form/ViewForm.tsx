export const ViewForm = () => {
    return (
        <>
            <div style={{ position: "relative", height: "700px", marginTop: 7 }}>
                <div
                    style={{ backgroundColor: "white", width: "100%", height: "68px", position: "absolute", zIndex: 1 }}
                >
                    &nbsp;
                </div>
                <iframe
                    src={`${process.env.REACT_APP_HAVE_EMPLOYEE_URL}&token=test1234`}
                    style={{ width: "100%", height: "700px" }}
                    onLoad={(e) => {}}
                ></iframe>
                {/* <div className="bottom-hider" style={{ backgroundColor: "white", width: "100%", height: "110px", position: "absolute", zIndex: 1, bottom: 0 }}>&nbsp;</div> */}
            </div>
        </>
    )
}
