export default () => {
  return (
    <div
      id="minimap"
      class="absolute bottom-2.5 right-2.5 h-38 w-64 bg-primary p-2 z-[1000]"
    >
      <div class="relative size-full border border-border bg-card z-[1000]">
        <div
          style={{
            position: "absolute",
            top: "50px",
            left: "10px",
            width: "20px",
            height: "20px",
            background: "#395",
          }}
        ></div>
      </div>
    </div>
  );
};

/*

#minimap {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 240px;
  height: 135px;
}
#minimap > * {
  border-radius: 10px;
  border: 1px solid #88888820;
  background-color: #88888810;
  z-index: 1000;
}
*/
