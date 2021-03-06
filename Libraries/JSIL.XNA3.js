"use strict";

if (typeof (JSIL) === "undefined")
  throw new Error("JSIL.Core required");

var $jsilxna = JSIL.DeclareAssembly("JSIL.XNA");

Microsoft.Xna.Framework.GraphicsDeviceManager.prototype._ctor = function (game) {
  this.game = game;
  this.device = new Microsoft.Xna.Framework.Graphics.GraphicsDevice();
  game.graphicsDeviceService = this;
};

Microsoft.Xna.Framework.GraphicsDeviceManager.prototype.get_GraphicsDevice = function () {
  return this.device;
};

Microsoft.Xna.Framework.Graphics.GraphicsDevice.prototype._ctor = function () {
  this.canvas = JSIL.Host.getCanvas();
  this.context = this.canvas.getContext("2d");
  this.viewport = new Microsoft.Xna.Framework.Graphics.Viewport();
  this.viewport.Width = this.canvas.clientWidth || this.canvas.width;
  this.viewport.Height = this.canvas.clientHeight || this.canvas.height;
};

Microsoft.Xna.Framework.Graphics.GraphicsDevice.prototype.get_Viewport = function () {
  return this.viewport;
};

Microsoft.Xna.Framework.Graphics.GraphicsDevice.prototype.set_Viewport = function (newViewport) {
  this.viewport = newViewport;
  this.canvas = JSIL.Host.getCanvas(this.viewport.Width, this.viewport.Height);
  this.context = this.canvas.getContext("2d");
};

Microsoft.Xna.Framework.Graphics.GraphicsDevice.prototype.InternalClear = function (color) {
  this.context.fillStyle = color.toCss();
  this.context.fillRect(0, 0, this.viewport.Width, this.viewport.Height);
};

Microsoft.Xna.Framework.Graphics.GraphicsDevice.prototype.DrawUserPrimitives = function (primitiveType, vertices, vertexOffset, primitiveCount) {
  switch (primitiveType) {
    case Microsoft.Xna.Framework.Graphics.PrimitiveType.LineList:
      for (var i = 0; i < primitiveCount; i++) {
        var j = i * 2;
        this.context.lineWidth = 2;
        this.context.strokeStyle = vertices[j].Color.toCss();
        this.context.beginPath();
        this.context.moveTo(vertices[j].Position.X, vertices[j].Position.Y);
        this.context.lineTo(vertices[j + 1].Position.X, vertices[j + 1].Position.Y);
        this.context.closePath();
        this.context.stroke();
      }

      break;
    default:
      JSIL.Host.error(new Error("The primitive type " + primitiveType.toString() + " is not implemented."));
      return;
  }
};

Microsoft.Xna.Framework.Graphics.SpriteBatch.prototype._ctor = function (device) {
  this.device = device;
};

Microsoft.Xna.Framework.Graphics.SpriteBatch.prototype.Begin = function () {
};

Microsoft.Xna.Framework.Graphics.SpriteBatch.prototype.InternalDraw = function (texture, position, sourceRectangle, color, rotation, origin, scale, effects) {
  var image = texture.image;
  var positionIsRect = typeof (position.Width) === "number";
  var scaleX = 1, scaleY = 1, originX = 0, originY = 0;
  var sourceX = 0, sourceY = 0, sourceW = image.naturalWidth, sourceH = image.naturalHeight;
  var positionX, positionY;
  if (typeof (scale) === "number")
    scaleX = scaleY = scale;
  else if ((typeof (scale) === "object") && (scale !== null) && (typeof (scale.X) === "number")) {
    scaleX = scale.X;
    scaleY = scale.Y;
  }

  positionX = position.X;
  positionY = position.Y;

  this.device.context.save();

  effects = effects || Microsoft.Xna.Framework.Graphics.SpriteEffects.None;

  if ((effects & Microsoft.Xna.Framework.Graphics.SpriteEffects.FlipHorizontally) == Microsoft.Xna.Framework.Graphics.SpriteEffects.FlipHorizontally) {
    this.device.context.scale(-1, 1);
    positionX = -positionX;
  }

  if ((effects & Microsoft.Xna.Framework.Graphics.SpriteEffects.FlipVertically) == Microsoft.Xna.Framework.Graphics.SpriteEffects.FlipVertically) {
    this.device.context.scale(1, -1);
    positionY = -positionY;
  }

  if ((typeof (origin) === "object") && (origin !== null) && (typeof (origin.X) === "number")) {
    originX = origin.X;
    positionX -= originX;
    originY = origin.Y;
    positionY -= originY;
  }

  if ((sourceRectangle !== null) && (sourceRectangle.value !== null)) {
    var sr = sourceRectangle.value;
    sourceX = sr.X;
    sourceY = sr.Y;
    sourceW = sr.Width;
    sourceH = sr.Height;
  }

  if ((typeof (color) === "object") && (color !== null)) {
    if ((color.R != 255) || (color.G != 255) || (color.B != 255)) {
      var newImage = $jsilxna.getImageMultiplied(image, color);
      if (newImage === image) {
        // Broken browser
      } else {
        image = newImage;
        sourceX += 1;
        sourceY += 1;
      }
    } else if (color.A != 255) {
      this.device.context.globalAlpha = color.A / 255;
    }
  }

  if (positionIsRect)
    this.device.context.drawImage(
      image, 
      sourceX, sourceY, sourceW, sourceH,
      positionX, positionY, position.Width * scaleX, position.Height * scaleY
    );
  else
    this.device.context.drawImage(
      image, 
      sourceX, sourceY, sourceW, sourceH,
      positionX, positionY, sourceW * scaleX, sourceH * scaleY
    );

  this.device.context.restore();
};

Microsoft.Xna.Framework.Graphics.SpriteBatch.prototype.InternalDrawString = function (font, text, position, color) {
  this.device.context.textBaseline = "top";
  this.device.context.textAlign = "start";
  this.device.context.font = font.toCss();
  this.device.context.fillStyle = color.toCss();
  this.device.context.fillText(text, position.X, position.Y);
};

Microsoft.Xna.Framework.Graphics.SpriteBatch.prototype.End = function () {
};

Microsoft.Xna.Framework.Graphics.Color.prototype._ctor$1 = function (r, g, b) {
  this.a = 255;
  this.r = r;
  this.g = g;
  this.b = b;
}
Microsoft.Xna.Framework.Graphics.Color.prototype._ctor$2 = function (r, g, b, a) {
  this.a = a;
  this.r = r;
  this.g = g;
  this.b = b;
}
Microsoft.Xna.Framework.Graphics.Color.prototype._ctor$3 = function (r, g, b) {
  this.a = 255;
  this.r = Math.floor(r * 255);
  this.g = Math.floor(g * 255);
  this.b = Math.floor(b * 255);
}
Microsoft.Xna.Framework.Graphics.Color.prototype._ctor$4 = function (r, g, b, a) {
  this.a = Math.floor(a * 255);
  this.r = Math.floor(r * 255);
  this.g = Math.floor(g * 255);
  this.b = Math.floor(b * 255);
}
Microsoft.Xna.Framework.Graphics.Color.prototype._ctor$5 = function (v3) {
  Microsoft.Xna.Framework.Graphics.Color.prototype._ctor$3.call(this, v3.X, v3.Y, v3.Z);
}
Microsoft.Xna.Framework.Graphics.Color.prototype._ctor$6 = function (v4) {
  Microsoft.Xna.Framework.Graphics.Color.prototype._ctor$4.call(this, v4.X, v4.Y, v4.Z, v4.W);
}

Microsoft.Xna.Framework.Graphics.Color.prototype.get_A = function () {
  return this.a;
}
Microsoft.Xna.Framework.Graphics.Color.prototype.get_R = function () {
  return this.r;
}
Microsoft.Xna.Framework.Graphics.Color.prototype.get_G = function () {
  return this.g;
}
Microsoft.Xna.Framework.Graphics.Color.prototype.get_B = function () {
  return this.b;
}

Microsoft.Xna.Framework.Graphics.Color.prototype.toCss = function () {
  if (this.A < 255) {
    return System.String.Format(
      "rgba({0}, {1}, {2}, {3})",
      this.R, this.G, this.B, this.A / 255.0
    );
  } else {
    return System.String.Format(
      "rgb({0}, {1}, {2})",
      this.R, this.G, this.B
    );
  }
}

Microsoft.Xna.Framework.Graphics.Color.prototype.MemberwiseClone = function () {
  var result = Object.create(Microsoft.Xna.Framework.Graphics.Color.prototype);
  result.a = this.a;
  result.r = this.r;
  result.g = this.g;
  result.b = this.b;
  return result;
}

$jsilxna.makeColor = function (r, g, b, a) {
  var result = Object.create(Microsoft.Xna.Framework.Graphics.Color.prototype);
  result.r = r;
  result.g = g;
  result.b = b;
  if (typeof (a) === "number")
    result.a = a;
  else
    result.a = 255;
  return result;
}

Microsoft.Xna.Framework.Graphics.Color._cctor = function () {
  var self = Microsoft.Xna.Framework.Graphics.Color;
  var makeColor = $jsilxna.makeColor;
  self.black = makeColor(0, 0, 0);
  self.transparentBlack = makeColor(0, 0, 0, 0);
  self.white = makeColor(255, 255, 255);
  self.transparentWhite = makeColor(255, 255, 255, 0);
  self.red = makeColor(255, 0, 0);
  self.yellow = makeColor(255, 255, 0);
  self.cornflowerBlue = makeColor(100, 149, 237);
};

Microsoft.Xna.Framework.Graphics.Color.get_Black = function () {
  return Microsoft.Xna.Framework.Graphics.Color.black;
};
Microsoft.Xna.Framework.Graphics.Color.get_TransparentBlack = function () {
  return Microsoft.Xna.Framework.Graphics.Color.transparentBlack;
};
Microsoft.Xna.Framework.Graphics.Color.get_White = function () {
  return Microsoft.Xna.Framework.Graphics.Color.white;
};
Microsoft.Xna.Framework.Graphics.Color.get_Red = function () {
  return Microsoft.Xna.Framework.Graphics.Color.red;
};
Microsoft.Xna.Framework.Graphics.Color.get_Yellow = function () {
  return Microsoft.Xna.Framework.Graphics.Color.yellow;
};
Microsoft.Xna.Framework.Graphics.Color.get_CornflowerBlue = function () {
  return Microsoft.Xna.Framework.Graphics.Color.cornflowerBlue;
};
Microsoft.Xna.Framework.Graphics.Color.get_TransparentWhite = function () {
  return Microsoft.Xna.Framework.Graphics.Color.transparentWhite;
};

JSIL.SealTypes(
  $jsilxna, "Microsoft.Xna.Framework.Graphics", 
  "Color"
);
